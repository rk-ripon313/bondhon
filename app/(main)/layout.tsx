import Navbar from "@/components/layout/navbar/Navbar";

import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = {
    name: "Ripon",
    image: "https://i.pravatar.cc/100",
  };
  return (
    <>
      <Navbar user={user} />
      <main className="">{children}</main>
    </>
  );
}
