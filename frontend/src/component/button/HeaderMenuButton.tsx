import { type FC } from "react";
import {
  InfoOutlineIcon,
  SettingsIcon,
  ChatIcon,
  HamburgerIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ModalType } from "@/view/modal/states";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { LogoutMenuItem } from "./LogoutButton";

type HeaderMenuProps = {
  onDrawerOpen: () => void;
  setModal: (t: ModalType) => void;
};

const HeaderMenu: FC<HeaderMenuProps> = (props) => {
  return (
    <Menu>
      <MenuButton
        marginLeft={10}
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList>
        <MenuGroup title="Basic">
          <AuthenticatedTemplate>
            <LogoutMenuItem />
            <MenuItem icon={<ChatIcon />} onClick={props.onDrawerOpen}>
              History
            </MenuItem>
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <MenuItem
              icon={<SettingsIcon />}
              onClick={() => {
                props.setModal("EntraId_Info");
              }}
            >
              Setup Entra ID Info
            </MenuItem>
          </UnauthenticatedTemplate>
          <MenuItem as={"a"} href="/" icon={<InfoOutlineIcon />}>
            Document
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="DANGER ZONE">
          <MenuItem
            icon={<WarningIcon />}
            onClick={() => {
              props.setModal("Delete");
            }}
          >
            RESET DATA
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default HeaderMenu;
