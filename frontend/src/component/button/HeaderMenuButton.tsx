import type { FC } from 'react';
import {
  InfoOutlineIcon,
  PlusSquareIcon,
  SettingsIcon,
  ChatIcon,
  HamburgerIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import type { ModalType } from '@/view/modal/states';
import { AuthenticatedTemplate } from '@azure/msal-react';
import { LogoutMenuItem } from './LogoutButton';

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
        <MenuGroup title="System">
          <MenuItem
            icon={<SettingsIcon />}
            onClick={() => {
              props.setModal('EntraId_Info');
            }}
          >
            Setup Entra ID Info
          </MenuItem>
          <AuthenticatedTemplate>
            <MenuItem
              icon={<PlusSquareIcon />}
              onClick={() => {
                props.setModal('UploadFolderID');
              }}
            >
              Upload Folder
            </MenuItem>

            <MenuItem icon={<ChatIcon />} onClick={props.onDrawerOpen}>
              History
            </MenuItem>
          </AuthenticatedTemplate>
          <MenuItem as={'a'} href="/" icon={<InfoOutlineIcon />}>
            Document
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="DANGER ZONE">
          <MenuItem
            icon={<WarningIcon />}
            onClick={() => {
              props.setModal('Delete');
            }}
          >
            RESET DATA
          </MenuItem>
          <LogoutMenuItem />
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default HeaderMenu;
