import dynamic from "next/dynamic";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerProps {
  children: React.ReactNode;
  getValue?: (emoji: string) => void;
}

export const EmojiPicker = ({ children, getValue }: EmojiPickerProps) => {
  const Picker = dynamic(() => import("emoji-picker-react"));

  const onEmojiClick = (selectedEmoji: any) => {
    if (getValue) {
      getValue(selectedEmoji.emoji);
    }
  };

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger className="cursor-pointer">{children}</PopoverTrigger>
        <PopoverContent className="p-0 border-none">
          <Picker onEmojiClick={onEmojiClick} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
