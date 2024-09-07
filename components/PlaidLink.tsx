/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { useCallback, useEffect, useState } from "react";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";

import { PlaidLinkProps } from "@/types";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createLinkToken } from "@/lib/actions/user.actions";

function PlaidLink({ user, variant }: PlaidLinkProps) {
  // Creating the state for a token
  const [token, setToken] = useState("");

  // Getting the router from the hook
  const router = useRouter();

  // Use Effect to get the link token on mount
  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };

    getLinkToken();
  }, [user]);

  // On success handler
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      // await exchangePublicToken({ publicToken: public_token, user });

      // Redirect to homepage if success
      router.push("/");
    },
    [user]
  );

  // Creating config file for the Plaid
  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  // Getting the open function and ready state
  const { open, ready } = usePlaidLink(config);

  // Returned JSX
  return (
    <>
      {variant === "primary" ? (
        <Button
          className="plaidlink-primary"
          onClick={() => {
            open();
          }}
          disabled={!ready}
        >
          Connect Bank
        </Button>
      ) : variant === "ghost" ? (
        <Button>Connect bank</Button>
      ) : (
        <Button>Connect Bank</Button>
      )}
    </>
  );
}

export default PlaidLink;
