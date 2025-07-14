import React, { createContext, useCallback, useContext } from 'react';
import { View, Pressable } from 'react-native';
import { toggleVariants, styles } from './ToggleGroup.styles';
import { ToggleGroupContextValue, ToggleGroupProps, ToggleGroupItemProps, Variant, Size } from './ToggleGroup.types';

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

const useToggleGroup = () => {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error('useToggleGroup deve ser usado dentro de um <ToggleGroup>');
  }
  return context;
};

const ToggleGroup = React.forwardRef<View, ToggleGroupProps>(
  ({ children, variant = 'default', size = 'default', type, value, onValueChange, style, ...props }, ref) => {
    
    const handleItemPress = useCallback((itemValue: string) => {
        if (type === 'multiple') {
            const newValue = Array.isArray(value) 
                ? (value.includes(itemValue) ? value.filter(v => v !== itemValue) : [...value, itemValue])
                : [itemValue];
            onValueChange(newValue);
        } else {
            const newValue = value === itemValue ? '' : itemValue;
            onValueChange(newValue);
        }
    }, [type, value, onValueChange]);

    const contextValue = { value, onValueChange: handleItemPress, type, variant, size };

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <View ref={ref} style={[styles.groupContainer, style]} {...props}>
          {children}
        </View>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = React.forwardRef<View, ToggleGroupItemProps>(
  ({ value: itemValue, children, style, ...props }, ref) => {
    const { value, onValueChange, type, variant, size } = useToggleGroup();
    
    const isSelected = type === 'multiple'
        ? Array.isArray(value) && value.includes(itemValue)
        : value === itemValue;

    const variantStyle = toggleVariants.variants[variant];
    const sizeStyle = toggleVariants.sizes[size];

    return (
      <Pressable
        ref={ref as React.Ref<any>}
        onPress={() => onValueChange(itemValue)}
        style={({ pressed }) => {
          const baseStyles = [
            toggleVariants.base,
            variantStyle,
            sizeStyle,
            (isSelected || pressed) && variantStyle.selected,
          ];

          const incomingStyle = typeof style === 'function' ? style({ pressed }) : style;

          return [
            ...baseStyles,
            incomingStyle,
          ];
        }}
        accessibilityState={{ selected: isSelected }}
        {...props}
      >
        {children}
      </Pressable>
    );
  }
);
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
