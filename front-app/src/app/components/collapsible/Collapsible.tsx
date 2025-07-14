// src/app/components/collapsible/Collapsible.tsx
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Pressable, Animated, type ViewProps, type PressableProps } from 'react-native';
import { styles } from './Collapsible.styles';
import { CollapsibleProps, CollapsibleContextValue } from './Collapsible.types';
 
const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

const useCollapsible = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('useCollapsible deve ser usado dentro de um <Collapsible>');
  }
  return context;
};

const Collapsible = React.forwardRef<View, CollapsibleProps>(
  ({ children, open, onOpenChange, defaultOpen = false, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const animation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

    const onToggle = useCallback(() => {
      if (isControlled) {
        onOpenChange?.(!isOpen);
      } else {
        setInternalOpen((prev) => !prev);
      }
    }, [isControlled, isOpen, onOpenChange]);

    useEffect(() => {
      Animated.timing(animation, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isOpen, animation]);

    const contextValue = { isOpen, onToggle, animation };

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <View ref={ref} {...props}>
          {children}
        </View>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = 'Collapsible';

const CollapsibleTrigger = React.forwardRef<View, PressableProps>(
  ({ children, ...props }, ref) => {
    const { onToggle } = useCollapsible();
    return (
      <Pressable ref={ref as React.Ref<any>} onPress={onToggle} {...props}>
        {children}
      </Pressable>
    );
  }
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleContent = React.forwardRef<View, ViewProps>(
  ({ children, style, ...props }, ref) => {
    const { isOpen, animation } = useCollapsible();
    const [contentHeight, setContentHeight] = useState(0);

    const animatedStyle = {
      height: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, contentHeight],
      }),
      opacity: animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
      }),
    };
    
    const onLayout = (event: { nativeEvent: { layout: { height: number } } }) => {
        const measuredHeight = event.nativeEvent.layout.height;
        if (measuredHeight > 0 && measuredHeight !== contentHeight) {
            setContentHeight(measuredHeight);
        }
    };

    const contentToRender = (
      <View style={styles.contentInner} onLayout={onLayout} {...props}>
        {children}
      </View>
    );

    if (!isOpen && contentHeight > 0) {
        return <Animated.View style={[styles.content, animatedStyle, style]} />;
    }

    return (
      <Animated.View style={[styles.content, animatedStyle, style]}>
        {/* Adiciona um container absoluto para medir a altura sem afetar o layout */}
        {contentHeight === 0 && <View style={styles.measuringContainer}>{contentToRender}</View>}
        {contentToRender}
      </Animated.View>
    );
  }
);
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
