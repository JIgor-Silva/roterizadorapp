import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, LayoutChangeEvent, PressableStateCallbackType } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { AccordionContextValue, AccordionItemContextValue, AccordionProps, AccordionTriggerProps, AccordionContentProps } from './Accordion.types';
import styles from './Accordion.styles';

const AccordionContext = createContext<AccordionContextValue | null>(null);
const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) { throw new Error('useAccordion deve ser usado dentro de um <Accordion>'); }
  return context;
};

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);
const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) { throw new Error('Componentes de AccordionItem devem ser usados dentro de um <AccordionItem>'); }
  return context;
};

export const Accordion = ({ children, type = 'single', defaultValue = [], ...props }: AccordionProps) => {
  const [value, setValue] = useState(defaultValue);
  const onValueChange = useCallback((itemValue: string) => {
    if (type === 'multiple') {
      setValue((prev) => prev.includes(itemValue) ? prev.filter((v) => v !== itemValue) : [...prev, itemValue]);
    } else {
      setValue((prev) => (prev.includes(itemValue) ? [] : [itemValue]));
    }
  }, [type]);
  return (
    <AccordionContext.Provider value={{ value, onValueChange, type }}>
      <View {...props}>{children}</View>
    </AccordionContext.Provider>
  );
};
Accordion.displayName = "Accordion";

export const AccordionItem = React.forwardRef<View, React.ComponentProps<typeof View> & { value: string }>(
  ({ children, className, value: itemValue, ...props }, ref) => {
    const { value: openItems, onValueChange } = useAccordion();
    const animation = useRef(new Animated.Value(0)).current;
    const isOpen = openItems.includes(itemValue);
    const onToggle = () => onValueChange(itemValue);
    useEffect(() => {
      Animated.timing(animation, { toValue: isOpen ? 1 : 0, duration: 200, useNativeDriver: false }).start();
    }, [isOpen, animation]);
    const contextValue = { value: itemValue, isOpen, onToggle, animation };
    return (
      <AccordionItemContext.Provider value={contextValue}>
        <View ref={ref} className={`border-b border-zinc-200 ${className}`} {...props}>
          {children}
        </View>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  View, 
  React.ComponentProps<typeof Pressable>
>(({ children, className, ...props }, ref) => {
  const { onToggle, animation } = useAccordionItem();
  const animatedIconStyle = {
    transform: [{
      rotate: animation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
    }]
  };

  return (
    <Pressable 
      ref={ref} 
      onPress={onToggle} 
      className={`flex-row items-center justify-between py-4 ${className}`} 
      {...props}
    >
      {(state: PressableStateCallbackType) => (
        <>
          <Text style={[styles.textWhite, {flex: 1, fontSize: 16, fontWeight: '500', color: '#18181b'}]}>
            {typeof children === 'function' ? children(state) : children}
          </Text>
          <Animated.View style={animatedIconStyle}>
            <ChevronDown size={18} color="#18181b" />
          </Animated.View>
        </>
      )}
    </Pressable>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ children, className, ...props }, ref) => {
    const { isOpen, animation } = useAccordionItem();
    const [contentHeight, setContentHeight] = useState(0);
    const animatedStyle = {
      height: animation.interpolate({ inputRange: [0, 1], outputRange: [0, contentHeight] }),
      opacity: animation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] }),
    };
    const onLayout = (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height;
      if (height > 0 && height !== contentHeight) {
        setContentHeight(height);
      }
    };
    if (!isOpen && contentHeight === 0) {
      return (
        <View className="absolute opacity-0 -z-10" onLayout={onLayout}>
          {children}
        </View>
      );
    }
    return (
      <Animated.View ref={ref} style={animatedStyle} className={`overflow-hidden ${className}`}>
        <View className="pb-4" onLayout={onLayout} {...props}>
          {children}
        </View>
      </Animated.View>
    );
  }
);
AccordionContent.displayName = "AccordionContent";
