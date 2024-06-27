import Link from "next/link";
import { NotebookPen } from "lucide-react";

import { Button } from "../ui/button";

export const Header = () => {
  return (
    <header className="p-4 flex justify-center items-center">
      <div>
        <Link
          href={"/"}
          className="w-full flex gap-2 justify-left items-center"
        >
          <NotebookPen className="text-brand-primary h-8 w-8" />
          <span className="font-semibold dark:text-white">notion.</span>
        </Link>
      </div>
      <aside className="flex w-full gap-2 justify-end">
        <Link href={"/sign-in"}>
          <Button variant="btn-secondary" className=" p-1 hidden sm:block">
            Login
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button variant="btn-primary" className="whitespace-nowrap">
            Sign Up
          </Button>
        </Link>
      </aside>
    </header>
  );
};
