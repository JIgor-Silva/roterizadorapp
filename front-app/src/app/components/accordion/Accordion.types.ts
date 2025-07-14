import { View, Pressable, Animated, LayoutChangeEvent } from 'react-native';
import { PressableStateCallbackType } from 'react-native';
import { ReactNode } from 'react';

export type AccordionContextValue = {
  value: string[];
  onValueChange: (itemValue: string) => void;
  type: 'single' | 'multiple';
};

export type AccordionItemContextValue = {
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  animation: Animated.Value;
};

export type AccordionProps = React.ComponentProps<typeof View> & {
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  children: ReactNode;
};

export type AccordionTriggerProps = React.ComponentProps<typeof Pressable> & {
  children: ReactNode | ((state: PressableStateCallbackType) => ReactNode);
};

export type AccordionContentProps = React.ComponentProps<typeof View> & {
  children: ReactNode;
};
