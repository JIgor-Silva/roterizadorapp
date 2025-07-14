import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle, type ViewProps, type LayoutChangeEvent, View } from 'react-native';

export interface PopoverContentProps extends ViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface PopoverTriggerProps {
  children: React.ReactElement<{ ref?: React.Ref<View>; onPress?: () => void; onLayout?: (event: LayoutChangeEvent) => void; }>;
}

export interface PopoverProps {
  children: ReactNode;
}
