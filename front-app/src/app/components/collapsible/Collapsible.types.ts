import { ViewProps, PressableProps } from 'react-native';

export interface CollapsibleProps extends ViewProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

import { Animated } from 'react-native';

export interface CollapsibleContextValue {
  isOpen: boolean;
  onToggle: () => void;
  animation: Animated.Value;
}
