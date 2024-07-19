import { CustomDialogTrigger } from "../global/custom-dialog-trigger";
import { SettingsForm } from "./settings-form";

interface SettingsProps {
  children: React.ReactNode;
}

export const Settings = ({ children }: SettingsProps) => {
  return (
    <CustomDialogTrigger title="Settings" content={<SettingsForm />}>
      {children}
    </CustomDialogTrigger>
  );
};
