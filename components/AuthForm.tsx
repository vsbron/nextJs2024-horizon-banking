"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authFormSchema } from "@/lib/utils";
import { signUp } from "@/lib/actions/user.actions";
// import { signIn } from "@/lib/actions/user.actions";

import FormInput from "./FormInput";
// import { useRouter } from "next/navigation";

function AuthForm({ type }: { type: string }) {
  // State for the user data and loading state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // // Getting the router from the hook
  // const router = useRouter();

  // Getting the form schema based on the form type we need
  const formSchema = authFormSchema(type);

  // Defining form and its default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
      email: "",
      password: "",
    },
  });

  // Defining a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Enabling loading state
    setIsLoading(true);

    try {
      // Sign up with Appwrite & create plaid token

      // If sign up page
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }

      // If sign in page
      if (type === "sign-in") {
        // const response = await signIn({
        //   email: data.email,
        //   password: data.password,
        // });
        // if (response) router.push("/");
      }
    } catch (err: any) {
      console.error(err.message);
    } finally {
      // Disabling loading state
      setIsLoading(false);
    }
  };

  // Returned JSX
  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="flex cursor-pointer items-center gap-1">
          {/* prettier-ignore */}
          <Image src="/icons/logo.svg" width={34} height={34} alt="Horizon logo" />
          <h2 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h2>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h2 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h2>
          {/* prettier-ignore */}
          <p className="text-16 font-normal text-gray-600">
            {user ? "Link your account to get started" : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* PlaidLink */}</div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {type === "sign-up" && (
              <>
                {/* prettier-ignore */}
                <div className="flex gap-4">
                  <FormInput control={form.control} name="firstName" label="First Name" placeholder="ex: John" />
                  <FormInput control={form.control} name="lastName" label="Last Name" placeholder="ex: Doe" />
                </div>
                {/* prettier-ignore */}
                <FormInput control={form.control} name="address1" label="Address" placeholder="Enter your specific address" />
                {/* prettier-ignore */}
                <FormInput control={form.control} name="city" label="City" placeholder="Enter your city" />
                {/* prettier-ignore */}
                <div className="flex gap-4">
                  <FormInput control={form.control} name="state" label="State" placeholder="ex: NY" />
                  <FormInput control={form.control} name="postalCode" label="Postal Code" placeholder="ex: 1110" />
                </div>
                {/* prettier-ignore */}
                <div className="flex gap-4">
                  <FormInput control={form.control} name="dateOfBirth" label="Date of Birth" placeholder="ex: yyyy-mm-dd" />
                  <FormInput control={form.control} name="ssn" label="SSN" placeholder="ex: 1234" />
                </div>
              </>
            )}
            {/* prettier-ignore */}
            <FormInput control={form.control} name="email" label="Email" placeholder="Enter your email" />
            {/* prettier-ignore */}
            <FormInput control={form.control} name="password" label="Password" placeholder="Enter your password" />
            <div className="flex flex-col gap-4">
              {/* prettier-ignore */}
              <Button className="form-btn" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <> <Loader2 size="20" className="animate-spin" /> &nbsp;Loading...</>
                ) : type === "sign-in" ? ("Sign In") : ("Sign Up")}
              </Button>
            </div>
          </form>
          <footer className="flex justify-center gap-1">
            {/* prettier-ignore */}
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in" ? "Don't have an account?" : "Already have an account?"}
            </p>
            {/* prettier-ignore */}
            <Link href={type === "sign-in" ? "/sign-up" : "sign-in"} className="form-link">
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </Form>
      )}
    </section>
  );
}

export default AuthForm;
