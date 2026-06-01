import Footer from "@/components/layout/Footer";
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
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
