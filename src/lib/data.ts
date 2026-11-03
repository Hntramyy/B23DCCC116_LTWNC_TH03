import "server-only";

import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import type { Deadline, DeadlineStore, Subject } from "@/lib/types";

const dataFile = path.join(process.cwd(), "data", "deadlines.json");
const blobPathname = "class-deadline-hub/deadlines.json";

function strongEtag(etag: string): string {
  return etag.startsWith("W/") ? etag.slice(2) : etag;
}

type StoreSnapshot = {
  store: DeadlineStore;
  etag?: string;
};

function isBlobStorageEnabled(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID),
  );
}

async function getBlobSnapshot(): Promise<StoreSnapshot> {
  const blob = await get(blobPathname, { access: "private", useCache: false });
  if (blob) {
    if (blob.statusCode !== 200) {
      throw new Error("Không thể đọc dữ liệu deadline mới nhất từ Vercel Blob.");
    }
    const contents = await new Response(blob.stream).text();
    return {
      store: JSON.parse(contents) as DeadlineStore,
      etag: strongEtag(blob.blob.etag),
    };
  }

  const seed = await readFile(dataFile, "utf8");
  try {
    const uploaded = await put(blobPathname, seed, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json; charset=utf-8",
    });
    return { store: JSON.parse(seed) as DeadlineStore, etag: uploaded.etag };
  } catch (error) {
    if (!(error instanceof BlobPreconditionFailedError)) throw error;

    const initialized = await get(blobPathname, { access: "private", useCache: false });
    if (!initialized || initialized.statusCode !== 200) {
      throw new Error("Không thể khởi tạo dữ liệu deadline trong Vercel Blob.");
    }
    const contents = await new Response(initialized.stream).text();
    return {
      store: JSON.parse(contents) as DeadlineStore,
      etag: strongEtag(initialized.blob.etag),
    };
  }
}

export async function getStoreSnapshot(): Promise<StoreSnapshot> {
  if (isBlobStorageEnabled()) return getBlobSnapshot();
  return {
    store: JSON.parse(await readFile(dataFile, "utf8")) as DeadlineStore,
  };
}

export async function getStore(): Promise<DeadlineStore> {
  return (await getStoreSnapshot()).store;
}

export async function getSubjects(): Promise<Subject[]> {
  return (await getStore()).subjects;
}

export async function getDeadlines(): Promise<Deadline[]> {
  return (await getStore()).deadlines;
}

export async function getUpcomingDeadlineNotifications(): Promise<Pick<Deadline, "id" | "title" | "dueDate">[]> {
  const now = Date.now();
  return (await getDeadlines())
    .filter((deadline) => Date.parse(deadline.dueDate) > now)
    .sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate))
    .slice(0, 3)
    .map(({ id, title, dueDate }) => ({ id, title, dueDate }));
}

export async function getDeadline(id: string): Promise<Deadline | undefined> {
  return (await getDeadlines()).find((deadline) => deadline.id === id);
}

export async function getSubject(slug: string): Promise<Subject | undefined> {
  return (await getSubjects()).find((subject) => subject.slug === slug);
}

export async function saveStore(store: DeadlineStore, expectedEtag?: string): Promise<void> {
  if (isBlobStorageEnabled()) {
    if (!expectedEtag) {
      throw new Error("Thiếu phiên bản dữ liệu để cập nhật kho deadline.");
    }
    try {
      await put(blobPathname, `${JSON.stringify(store, null, 2)}\n`, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json; charset=utf-8",
        ifMatch: expectedEtag,
      });
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) {
        throw new Error("Dữ liệu vừa được thay đổi ở nơi khác. Hãy tải lại trang rồi thử lại.");
      }
      throw error;
    }
    return;
  }

  const temporaryFile = `${dataFile}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(temporaryFile, dataFile);
}
