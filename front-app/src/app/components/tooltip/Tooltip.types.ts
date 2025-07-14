import { StyleProp, ViewStyle } from 'react-native';

export interface TooltipProviderProps {
  children: React.ReactNode;
}

export interface TooltipTriggerProps {
  children: React.ReactNode;
}

export interface TooltipContentProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export interface TooltipProps {
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}
