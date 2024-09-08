import Image from "next/image";
import { useRouter } from "next/navigation";

import { FooterProps } from "@/types";
import { logoutAccount } from "@/lib/actions/user.actions";

function Footer({ user, type = "desktop" }: FooterProps) {
  // Getting the router from the hook
  const router = useRouter();

  // Log out user handler
  const handleLogOut = async () => {
    // Getting the loggedOut object from server action
    const loggedOut = await logoutAccount();

    // If successful push out to sign-in
    if (loggedOut) router.push("/sign-in");
  };

  // Returned JSX
  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-700">{user.name[0]}</p>
      </div>
      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h2 className="text-14 truncate font-semibold text-gray-700">
          {user.name}
        </h2>
        <p className="text-14 truncate font-normal text-gray-600">
          {user.email}
        </p>
      </div>
      <div className="footer_image" onClick={handleLogOut}>
        <Image src="/icons/logout.svg" fill alt="Log out" />
      </div>
    </footer>
  );
}

export default Footer;
