"use server";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { createAdminClient, createSessionClient } from "../appwrite";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { plaidClient } from "../plaid";

import {
  createBankAccountProps,
  exchangePublicTokenProps,
  signInProps,
  SignUpParams,
  User,
} from "@/types";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

// Getting some constants from env file
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

// Server action for Signing In
export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Getting the account object from Appwrite
    const { account } = await createAdminClient();

    // Getting the response of authentication
    const response = await account.createEmailPasswordSession(email, password);

    // Setting the cookies for the session
    cookies().set("appwrite-session", response.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    // Returning the parsed response
    return parseStringify(response);
  } catch (err: any) {
    console.error("Error: " + err.message);
  }
};

// Server action for Signing Up
export const signUp = async ({ password, ...userData }: SignUpParams) => {
  // Destructuring the form data
  const { firstName, lastName, email } = userData;

  let newUserAccount;

  try {
    // Getting the account object from Appwrite
    const { account, database } = await createAdminClient();

    // Creating user with necessary fields
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    // Guard clause of a process so far
    if (!newUserAccount) throw new Error("Error creating user");

    // Creating Dwolla customer
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    // Guard clause of a process so far
    if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");

    // Extracting Dwolla customer ID
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    // Creating the new user object
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
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
    console.error("Error fetching logged-in user:", error);
    return null;
  }
}

// Server action for logging out
export async function logoutAccount() {
  try {
    // Getting the account object from appwrite
    const { account } = await createSessionClient();

    // Deleting the cookies
    cookies().delete("appwrite-session");

    // Deleting the current session
    await account.deleteSession("current");
  } catch {
    return null;
  }
}

// Server action for creating a link token
export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id!,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (err: any) {
    console.error(err.message);
  }
};

// Server action to create a bank account
export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    // Getting the database
    const { database } = await createAdminClient();
    // Create the bank account in the database
    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    );

    return parseStringify(bankAccount);
  } catch (err: any) {
    console.error(err.message);
  }
};

// Server action that exchanges our existing token for a token that allows us to use banking features
export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse =
      await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId!,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareable ID
    await createBankAccount({
      userId: user.$id!,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (err: any) {
    console.error(
      "An error occurred while creating exchanging token:",
      err.message
    );
  }
};
