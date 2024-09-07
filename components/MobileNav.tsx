"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import { MobileNavProps } from "@/types";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Footer from "./Footer";

function MobileNav({ user }: MobileNavProps) {
  // Getting the current pathname
  const pathname = usePathname();

  // Returned JSX
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            className="cursor-pointer"
            width={30}
            height={30}
            alt="Menu"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex cursor-pointer items-center gap-1 px-4"
            >
              <Image
                src="/icons/logo.svg"
                width={34}
                height={34}
                alt="Horizon logo"
              />
              <h2 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                Horizon
              </h2>
            </Link>
            <div className="mobilenav-sheet">
              <SheetClose asChild>
                <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                  {sidebarLinks.map((item) => {
                    // Checking if current route matches the menu item
                    const isActive =
                      pathname === item.route ||
                      pathname.startsWith(`${item.route}/`);

                    // Returning the nav link
                    return (
                      <SheetClose asChild key={item.route}>
                        <Link
                          href={item.route}
                          className={cn("mobilenav-sheet_close w-full", {
                            "bg-bank-gradient": isActive,
                          })}
                        >
                          <Image
                            src={item.imgURL}
                            className={cn({
                              "brightness-[3] invert-0": isActive,
                            })}
                            width={20}
                            height={20}
                            alt={item.label}
                          />
                          <p
                            className={cn(
                              "text-16 font-semibold text-black-2",
                              {
                                "text-white": isActive,
                              }
                            )}
                          >
                            {item.label}
                          </p>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </SheetClose>
              <Footer user={user} type="mobile" />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export default MobileNav;
