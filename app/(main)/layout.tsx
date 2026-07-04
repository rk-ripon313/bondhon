import { auth } from "@/auth";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/navbar/Navbar";
import { SessionUser } from "@/types/user.type";

import React from "react";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // console.log(session);

  const user: SessionUser | null = session?.user ?? null;
  return (
    <>
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
