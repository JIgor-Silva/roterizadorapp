import { ViewStyle, TextStyle, ViewProps, TouchableOpacityProps } from 'react-native';

export interface CustomToastProps {
  text1?: string;
  text2?: string;
  type?: 'default' | 'destructive';
  props?: {
    action?: {
      label: string;
      onPress: () => void;
    };
  };
}

export interface ToastStyles {
  base: ViewStyle;
  variants: {
    default: ViewStyle;
    destructive: ViewStyle;
  };
  textVariants: {
    default: {
      title: TextStyle;
      description: TextStyle;
    };
    destructive: {
      title: TextStyle;
      description: TextStyle;
    };
  };
  action: ViewStyle;
  actionText: TextStyle;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

export interface ToastComponentProps {
  children: React.ReactNode;
}

export interface ToastTitleProps {
  children: React.ReactNode;
}

export interface ToastDescriptionProps {
  children: React.ReactNode;
}

export interface ToastActionProps {
  children: React.ReactNode;
}
