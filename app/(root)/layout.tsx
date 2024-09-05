import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Temp user
  const loggedIn = { firstName: "BroN", lastName: "VS" };

  // Returned JSX
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="Logo" />
          <div>
            <MobileNav user={loggedIn}></MobileNav>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
