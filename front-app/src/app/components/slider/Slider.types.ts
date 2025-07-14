import { ViewProps } from 'react-native';
import RNSlider from '@react-native-community/slider';

export interface SliderProps extends ViewProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number[]) => void;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export type SliderRef = RNSlider;