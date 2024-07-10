interface DropdownProps {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Dropdown = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}: DropdownProps) => {
  return <div>Dropdown</div>;
};
