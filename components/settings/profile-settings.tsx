import { FilePenIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const ProfileSettings = () => {
  return (
    <div className="border-b border-muted pb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <Label htmlFor="name" className="text-lg font-semibold">
              Name
            </Label>
            <Input id="name" defaultValue="Rene Ruano" className="mt-1" />
            <p className="text-sm text-muted-foreground mt-1">
              Your name may appear around GitHub where you contribute or are
              mentioned. You can remove it at any time.
            </p>
          </div>

          <div>
            <Label htmlFor="password" className="text-lg font-semibold">
              Password
            </Label>
            <div className="flex items-center gap-2">
              <Input id="password" type="password" className="mt-1" />
              <Button variant="outline" size="sm">
                <FilePenIcon className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              You can change your password at any time.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Label className="text-lg font-semibold">Profile picture</Label>
          <Avatar className="w-32 h-32 rounded-full">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>PP</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            <FilePenIcon className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
