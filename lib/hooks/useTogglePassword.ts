import { useState } from "react";

export default function useTogglePassword() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const showPasswordHandler = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setShowPassword(!showPassword);
  };

  const showConfirmPasswordHandler = (
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    showPassword,
    showPasswordHandler,
    showConfirmPassword,
    showConfirmPasswordHandler,
  };
}
