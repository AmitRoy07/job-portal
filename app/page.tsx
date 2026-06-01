import { getCurrentUser } from "@/feature/auth/server/auth.queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Job Portal",
  description: "Create your Job Portal account and get started.",
};

export default async function Home() {
  const user = await getCurrentUser();

  console.log(user);

  return (
    <h1 className="text-3xl font-bold underline">{user?.name}, Hello world!</h1>
  );
}
