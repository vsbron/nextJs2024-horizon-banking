"use server";

import { signInProps, SignUpParams } from "@/types";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { parseStringify } from "../utils";

// Server action for Signing In
export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Getting the account object from Appwrite
    const { account } = await createAdminClient();

    // Getting the response of authentication
    const response = await account.createEmailPasswordSession(email, password);

    // Returning the parsed response
    return parseStringify(response);
  } catch (err: any) {
    console.error("Error: " + err.message);
  }
};

// Server action for Signing Up
export const signUp = async (userData: SignUpParams) => {
  // Destructuring the form data
  const { firstName, lastName, email, password } = userData;

  try {
    // Getting the account object from Appwrite
    const { account } = await createAdminClient();

    // Creating user with necessary fields
    const newUser = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    // Creating the session with email and password
    const session = await account.createEmailPasswordSession(email, password);

    // Setting the cookies
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    // Returning the stringified user
    return parseStringify(newUser);
  } catch (err: any) {
    console.error("Error: " + err.message);
  }
};

// Server action for getting logged in user
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}
