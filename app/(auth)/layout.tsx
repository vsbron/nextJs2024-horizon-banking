import Image from "next/image";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Returned JSX
  return (
    <main className="flex min-h-screen w-full font-inter">
      {children}
      <div className="auth-asset">
        <div>
          <Image
            src="/icons/auth-image.svg"
            width={500}
            height={500}
            alt="Auth image"
          />
        </div>
      </div>
    </main>
  );
}
