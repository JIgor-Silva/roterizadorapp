import { ViewProps } from 'react-native';

export interface AspectRatioProps extends ViewProps {
  ratio?: number;
  children?: React.ReactNode;
}
