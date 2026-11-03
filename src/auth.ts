import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import type { Role } from "@/lib/types";

type Account = {
  id: string;
  email: string;
  password: string;
  role: Exclude<Role, "guest">;
  name: string;
};

const accounts: Account[] = [
  {
    id: "ptit-admin",
    email: "admin@ptit.edu.vn",
    password: "admin123",
    role: "admin",
    name: "Admin",
  },
  {
    id: "ptit-student",
    email: "sv@ptit.edu.vn",
    password: "sv123456",
    role: "user",
    name: "Sinh viên",
  },
];

const providers = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mật khẩu", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials.email;
      const password = credentials.password;
      if (typeof email !== "string" || typeof password !== "string") {
        return null;
      }

      const account = accounts.find(
        (entry) => entry.email === email && entry.password === password,
      );
      if (!account) return null;

      return {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
      };
    },
  }),
  ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
    ? [GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      })]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? (process.env.NODE_ENV === "development" ? "deadline-hub-development-secret-change-me" : undefined),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.id = account?.provider === "github" ? `github:${user.id}` : user.id;
        const role = account?.provider === "github" ? "user" : user.role;
        if (role === "admin" || role === "user") token.role = role;
      }
      return token;
    },
    session({ session, token }) {
      const id: unknown = token.id;
      const role: unknown = token.role;
      if (session.user && typeof id === "string" && (role === "admin" || role === "user")) {
        session.user.id = id;
        session.user.role = role;
      }
      return session;
    },
  },
});
