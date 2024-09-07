import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getLoggedInUser } from "@/lib/actions/user.actions";

import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Getting the logged in user data
  const loggedIn = await getLoggedInUser();

  // Redirect user if not authenticated
  if (!loggedIn) redirect("/sign-in");

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
