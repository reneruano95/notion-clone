"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
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
import { signIn } from "@/lib/server-actions/auth-actions";

const signInSchema = z.object({
  email: z.string().describe("Email").email("Invalid email address."),
  password: z
    .string()
    .describe("Password")
    .min(6, "Password must be at least 6 characters."),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const router = useRouter();
  const { showPassword, showPasswordHandler } = useTogglePassword();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit: SubmitHandler<SignInFormValues> = async (formData) => {
    const { error } = await signIn(formData);

    if (error) {
      toast.error(
        error.message ? error.message : "Something went wrong. Please try again"
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

          <FormField
            disabled={isLoading}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
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

          <Button type="submit" className="w-full">
            {isLoading ? <Loader /> : "Sign In"}
          </Button>
          {/* <Button variant="outline" type="button" className="w-full">
            Sign In with Google
          </Button> */}
        </div>
        <div className="mt-4 text-center text-sm text-foreground/60">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline text-primary">
            Sign Up
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
