"use client";

import Link from "next/link";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, NotebookPen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useTogglePassword from "@/lib/hooks/useTogglePassword";
import { Loader } from "../global/loader";
import { cn, isEmpty } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { signUp } from "@/lib/server-actions/auth-actions";
import { useRouter } from "next/navigation";

const signUpSchema = z
  .object({
    firstName: z
      .string()
      .describe("First name")
      .min(1, "First name is required."),
    lastName: z.string().describe("Last name").min(1, "Last name is required."),
    email: z.string().describe("Email").email("Invalid email address."),
    password: z
      .string()
      .describe("Password")
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z
      .string()
      .describe("Confirm password")
      .min(
        6,
        "Confirm password must be at least 6 characters & match password."
      ),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const router = useRouter();

  const {
    showPassword,
    showPasswordHandler,
    showConfirmPassword,
    showConfirmPasswordHandler,
  } = useTogglePassword();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<SignUpFormValues> = async (formData) => {
    const { error } = await signUp(formData);

    if (error) {
      toast.error(
        error.message
          ? error.message
          : error.code
          ? `${error.code}. Please try again`
          : "Something went wrong. Please try again"
      );

      form.reset();
    } else {
      toast.success("Sign in successful");
      router.push("/dashboard");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 max-w-md">
        <div className="mb-6">
          <Link href="/" className=" w-full flex justify-left items-center">
            <NotebookPen className="text-brand-primary h-10 w-10 mr-2" />
            <span className="font-semibold dark:text-white text-4xl">
              notion.
            </span>
          </Link>
          <FormDescription className="text-foreground/60 mt-2">
            An all-In-One Collaboration and Productivity Platform
          </FormDescription>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="first-name" className="text-lg">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="first-name"
                      placeholder=""
                      {...field}
                      type="text"
                      className="!mt-0"
                      autoComplete="given-name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="last-name" className="text-lg">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="last-name"
                      placeholder=""
                      {...field}
                      type="text"
                      className="!mt-0"
                      autoComplete="family-name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            disabled={isLoading}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="email" className="text-lg">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder=""
                    {...field}
                    type="email"
                    className="!mt-0"
                    autoComplete="email"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2 col-span-2 sm:col-span-1">
                  <FormLabel htmlFor="password" className="text-lg">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center !mt-0">
                      <Input
                        id="password"
                        {...field}
                        className="rounded-e-none"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                      />
                      <Button
                        asChild
                        onClick={() => showPasswordHandler()}
                        className="text-muted-foreground p-0 h-10 w-10 m-0 rounded-s-none bg-transparent hover:bg-muted border border-input border-s-0"
                      >
                        <div>
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 m-0" />
                          ) : (
                            <Eye className="h-5 w-5 m-0" />
                          )}
                        </div>
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="grid gap-2 col-span-2 sm:col-span-1">
                  <FormLabel htmlFor="confirm-password" className="text-lg">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center !mt-0">
                      <Input
                        id="confirm-password"
                        {...field}
                        className="rounded-e-none !mt-0"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="current-password"
                      />
                      <Button
                        asChild
                        onClick={() => showConfirmPasswordHandler()}
                        className="text-muted-foreground p-0 h-10 w-10 m-0 rounded-s-none bg-transparent hover:bg-muted border border-input border-s-0"
                      >
                        <div>
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 m-0" />
                          ) : (
                            <Eye className="h-5 w-5 m-0" />
                          )}
                        </div>
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            {isLoading ? <Loader /> : "Sign up"}
          </Button>
          {/* <Button variant="outline" type="button" className="w-full">
            Sign up with Google
          </Button> */}
        </div>
        <div className="mt-4 text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline text-primary">
            Sign In
          </Link>
        </div>

        <div className="w-full mt-4 flex flex-col ">
          <div
            className={cn(
              "hidden",
              form.formState.isSubmitSuccessful && "hidden",
              !isEmpty(form.formState.errors) && "block"
            )}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {Object.values(form.formState.errors).map((error) => (
                  <p key={error.message} className="text-sm">
                    {error.message}
                  </p>
                ))}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </form>
    </Form>
  );
};
