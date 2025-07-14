import { ReactNode } from 'react';
import { View, Pressable } from 'react-native';

export type AlertDialogContextValue = {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export type AlertDialogContentProps = {
  children: ReactNode;
  className?: string;
};

export type ButtonProps = React.ComponentProps<typeof Pressable> & { children: ReactNode };
