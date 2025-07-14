// src/app/components/drawer/Drawer.types.ts
import { ViewProps, TextProps } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { BottomSheetProps } from '@gorhom/bottom-sheet';

export type SimpleComponentProps = {
  children: React.ReactNode;
};

export interface SidebarMenuButtonProps {
  routeName: string;
  label: string;
  iconName: string;
  isActive?: boolean;
}

export interface CustomSidebarProps extends DrawerContentComponentProps {}

export interface DrawerContextValue {
  drawerRef: React.RefObject<any | null>;
  open: () => void;
  close: () => void;
}

export interface DrawerProps extends Omit<BottomSheetProps, 'children'> {
    children: React.ReactNode;
}
