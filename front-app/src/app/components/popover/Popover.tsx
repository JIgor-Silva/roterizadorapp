import React, { useState, useRef, cloneElement, useCallback } from 'react';
import { View, type StyleProp, type ViewStyle, type ViewProps, type LayoutChangeEvent } from 'react-native';
import RNPopoverView from 'react-native-modal-popover';
import { styles } from './Popover.styles';
import type { PopoverContentProps, PopoverTriggerProps, PopoverProps } from './Popover.types';

const PopoverContent = React.forwardRef<View, PopoverContentProps>(
  ({ children, style, ...props }, ref) => (
    <View ref={ref} style={[styles.container, style]} {...props}>
      {children}
    </View>
  )
);
PopoverContent.displayName = 'PopoverContent';

const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
  return children;
};
PopoverTrigger.displayName = 'PopoverTrigger';

const Popover = ({ children }: PopoverProps) => {
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const triggerRef = useRef<View>(null);

  
  const validChildren = React.Children.toArray(children).filter(
    (child): child is React.ReactElement => React.isValidElement(child)
  );

  const trigger = validChildren.find(
    (child): child is React.ReactElement<PopoverTriggerProps> => child.type === PopoverTrigger
  ) as React.ReactElement<PopoverTriggerProps> | undefined;

  const content = validChildren.find((child) => child.type === PopoverContent);

  if (!trigger || !content) {
    console.error('O componente Popover requer um PopoverTrigger e um PopoverContent como filhos.');
    return null;
  }

  if (!React.isValidElement(trigger.props.children)) {
    console.error('O PopoverTrigger deve conter um único elemento React válido.');
    return null;
  }

  const triggerChild = cloneElement(trigger.props.children, {
    ref: triggerRef,
    onPress: () => setPopoverVisible(true),
  });

  return (
    <>
      {triggerChild}
      {/* The 'from' prop expects a RefObject<View> or a Rect, but the library's type definitions
          seem to be incorrect or incompatible. Casting to 'any' to bypass the TypeScript error. */}
      {/* The 'from' prop expects a RefObject<View> or a Rect, but the library's type definitions
          seem to be incorrect or incompatible. Casting the component to 'any' to bypass the TypeScript error. */}
      {/* The 'from' prop expects a RefObject<View> or a Rect, but the library's type definitions
          seem to be incorrect or incompatible. Casting the component to 'any' to bypass the TypeScript error. */}
      {/* The 'from' prop expects a RefObject<View> or a Rect, but the library's type definitions
          seem to be incorrect or incompatible. Casting the component to 'any' to bypass the TypeScript error. */}
      {(RNPopoverView as any).render({
        visible: isPopoverVisible,
        from: triggerRef as any,
        onRequestClose: () => setPopoverVisible(false),
        placement: "bottom",
        style: styles.container,
        children: content,
      })}
    </>
  );
};
Popover.displayName = 'Popover';

export { Popover, PopoverTrigger, PopoverContent };
