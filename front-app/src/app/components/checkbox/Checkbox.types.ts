import { ViewProps } from 'react-native';

export interface CheckboxProps extends ViewProps {
  checked?: boolean | 'indeterminate';
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
}
