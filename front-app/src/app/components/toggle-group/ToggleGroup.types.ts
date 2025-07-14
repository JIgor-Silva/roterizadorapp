import { ViewProps, PressableProps } from 'react-native';

export type Variant = 'default' | 'outline';
export type Size = 'default' | 'sm' | 'lg';

export interface ToggleGroupContextValue {
  value: string | string[];
  onValueChange: (itemValue: string) => void;
  type: 'single' | 'multiple';
  variant: Variant;
  size: Size;
}

export interface ToggleGroupProps extends ViewProps {
  type: 'single' | 'multiple';
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  variant?: Variant;
  size?: Size;
}

export interface ToggleGroupItemProps extends PressableProps {
  value: string;
  children: React.ReactNode;
}
