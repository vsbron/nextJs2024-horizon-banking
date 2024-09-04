import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Returned JSX
  return (
    <main>
      SIDEBAR
      {children}
    </main>
  );
}
