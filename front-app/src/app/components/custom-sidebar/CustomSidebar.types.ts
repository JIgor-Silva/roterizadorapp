// src/app/components/custom-sidebar/CustomSidebar.types.ts
import { ViewProps, TextProps } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

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
