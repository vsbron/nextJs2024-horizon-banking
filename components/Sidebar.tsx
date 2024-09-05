"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import { SidebarProps } from "@/types";
import { cn } from "@/lib/utils";

function Sidebar({ user }: SidebarProps) {
  // Getting the current pathname
  const pathname = usePathname();

  // Returned JSX
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 flex cursor-pointer items-center gap-2">
          <Image
            src="/icons/logo.svg"
            className="size-[24px] max-xl:size-14"
            width={34}
            height={34}
            alt="Horizon logo"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        {sidebarLinks.map((item) => {
          // Checking if current route matches the menu item
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          // Returning the nav link
          return (
            <Link
              href={item.route}
              className={cn("sidebar-link", { "bg-bank-gradient": isActive })}
              key={item.label}
            >
              <div className="relative size-6">
                <Image
                  src={item.imgURL}
                  className={cn({ "brightness-[3] invert-0": isActive })}
                  alt={item.label}
                  fill
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {item.label}
              </p>
            </Link>
          );
        })}
        USER
      </nav>
      FOOTER
    </section>
  );
}

export default Sidebar;
