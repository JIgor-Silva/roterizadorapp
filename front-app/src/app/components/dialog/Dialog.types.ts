import { ViewProps, TextProps } from 'react-native';

export type SimpleComponentProps = {
  children: React.ReactNode;
};

export interface DialogContextValue {
  visible: boolean;
  open: () => void;
  close: () => void;
}

export interface DialogProps {
  children: React.ReactNode;
}
