import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CustomDialogTriggerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  content?: React.ReactNode;
  className?: string;
}

export const CustomDialogTrigger = ({
  children,
  title,
  description,
  content,
  className,
}: CustomDialogTriggerProps) => {
  return (
    <Dialog>
      <DialogTrigger className={cn(className)}>{children}</DialogTrigger>
      <DialogContent className="h-screen block sm:h-[440px] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
