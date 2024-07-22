import { useTheme } from "next-themes";

import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface IconPickerProps {
  children: React.ReactNode;
  asChild?: boolean;
  getValue?: (emoji: string) => void;
}

export const IconPicker = ({
  children,
  asChild,
  getValue,
}: IconPickerProps) => {
  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };

  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "dark") as keyof typeof themeMap;

  const theme = themeMap[currentTheme];

  const onEmojiClick = (selectedEmoji: any) => {
    if (getValue) {
      getValue(selectedEmoji.emoji);
    }
  };

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger className="cursor-pointer" asChild={asChild}>
          {children}
        </PopoverTrigger>
        <PopoverContent className="p-0 border-none shadow-none">
          <EmojiPicker onEmojiClick={onEmojiClick} height={350} theme={theme} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
