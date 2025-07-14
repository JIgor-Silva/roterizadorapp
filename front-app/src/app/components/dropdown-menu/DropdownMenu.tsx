// src/app/components/dropdown-menu/DropdownMenu.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  type ViewProps,
  type TextProps,
} from 'react-native';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers,
  type MenuProps,
} from 'react-native-popup-menu';
import { Check, ChevronRight, Circle } from 'lucide-react-native';
import { styles } from './DropdownMenu.styles';
import { themeColors } from '@/app/styles/theme';
import { DropdownMenuProps } from './DropdownMenu.types';

const DropdownMenu = (props: DropdownMenuProps) => <Menu {...props} />;

const DropdownMenuTrigger = MenuTrigger;

const DropdownMenuContent = ({ children, style }: { children: React.ReactNode, style?: ViewProps['style'] }) => (
  <MenuOptions
    customStyles={{
      optionsContainer: [styles.contentContainer, style],
    }}
  >
    {children}
  </MenuOptions>
);

const DropdownMenuItem = ({ children, onSelect, disabled, inset }: { children: React.ReactNode; onSelect?: () => void; disabled?: boolean; inset?: boolean; }) => (
  <MenuOption onSelect={onSelect} disabled={disabled} style={styles.menuOption}>
    <View style={[styles.item, inset && styles.itemInset]}>
      {typeof children === 'string' ? <Text style={styles.itemText}>{children}</Text> : children}
    </View>
  </MenuOption>
);

const DropdownMenuCheckboxItem = ({ children, checked, onSelect, disabled }: { children: React.ReactNode; checked: boolean; onSelect?: () => void; disabled?: boolean; }) => (
  <MenuOption onSelect={onSelect} disabled={disabled} style={styles.menuOption}>
    <View style={styles.item}>
      <View style={styles.itemIndicator}>
        {checked && <Check size={16} color={themeColors.popoverForeground} />}
      </View>
      <Text style={styles.itemText}>{children}</Text>
    </View>
  </MenuOption>
);

const DropdownMenuRadioItem = ({ children, selected, onSelect, disabled }: { children: React.ReactNode; selected: boolean; onSelect?: () => void; disabled?: boolean; }) => (
  <MenuOption onSelect={onSelect} disabled={disabled} style={styles.menuOption}>
    <View style={styles.item}>
      <View style={styles.itemIndicator}>
        {selected && <Circle size={8} color={themeColors.popoverForeground} fill={themeColors.popoverForeground} />}
      </View>
      <Text style={styles.itemText}>{children}</Text>
    </View>
  </MenuOption>
);

const DropdownMenuSub = Menu;
const DropdownMenuSubTrigger = ({ children, inset }: { children: React.ReactNode; inset?: boolean; }) => (
  <View style={[styles.item, styles.subTrigger, inset && styles.itemInset]}>
    <Text style={styles.itemText}>{children}</Text>
    <ChevronRight size={16} color={themeColors.mutedForeground} style={{ marginLeft: 'auto' }} />
  </View>
);
const DropdownMenuSubContent = DropdownMenuContent;

const DropdownMenuLabel = ({ children, inset }: { children: React.ReactNode; inset?: boolean; }) => (
  <Text style={[styles.label, inset && styles.itemInset]}>{children}</Text>
);
const DropdownMenuSeparator = () => <View style={styles.separator} />;
const DropdownMenuShortcut = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.shortcut}>{children}</Text>
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
};
