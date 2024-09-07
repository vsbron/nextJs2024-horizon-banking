import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

// Creating new configuration file with .env constants
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

// Exporting plaid client object that is returned from constructor with configuration
export const plaidClient = new PlaidApi(configuration);
