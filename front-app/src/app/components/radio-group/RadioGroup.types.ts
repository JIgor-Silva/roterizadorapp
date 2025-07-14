import { type ReactNode } from 'react';
import { type TouchableOpacityProps, type StyleProp, type ViewStyle } from 'react-native';

export interface RadioGroupContextValue {
  value: string | null;
  onValueChange: (newValue: string) => void;
}

export interface RadioGroupProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface RadioGroupItemProps extends TouchableOpacityProps {
  value: string;
}
