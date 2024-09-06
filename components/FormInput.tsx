"use client";

import { Control } from "react-hook-form";
import { z } from "zod";

import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authFormSchema } from "@/lib/utils";

// Getting the maximum auth form schema
const formSchema = authFormSchema("sign-up");

// Interface for the custom component
interface FormInputInterface {
  control: Control<z.infer<typeof formSchema>>;
  name: keyof z.infer<typeof formSchema>;
  label: string;
  placeholder: string;
}

function FormInput({ control, name, label, placeholder }: FormInputInterface) {
  // Returned JSX
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                className="input-class"
                {...field}
                placeholder={placeholder}
                type={name === "password" ? "password" : "text"}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
}

export default FormInput;
