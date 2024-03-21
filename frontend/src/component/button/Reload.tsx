import { RepeatIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Reload: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <IconButton
      aria-label={"reload"}
      size={"xs"}
      icon={<RepeatIcon />}
      mx={"2"}
      onClick={() => {
        navigate(`${location.pathname}`);
      }}
    />
  );
};
