import Sidebar from "@/components/Sidebar";
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
      {children}
    </main>
  );
}
