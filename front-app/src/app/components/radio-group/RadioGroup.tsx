import React, { createContext, useContext, useState, forwardRef } from 'react';
import { View, TouchableOpacity, type ViewProps, type TouchableOpacityProps } from 'react-native';
import { styles } from './RadioGroup.styles';
import type { RadioGroupProps, RadioGroupItemProps, RadioGroupContextValue } from './RadioGroup.types';

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

// --- Hooks e Componentes ---

const useRadioGroup = () => {
    const context = useContext(RadioGroupContext);
    if (!context) {
        throw new Error("useRadioGroup deve ser usado dentro de um RadioGroup");
    }
    return context;
}

const RadioGroup = forwardRef<View, RadioGroupProps>(
  ({ children, style, defaultValue, value: controlledValue, onValueChange }, ref) => {

    const [internalValue, setInternalValue] = useState(defaultValue || null);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const contextValue = { value, onValueChange: handleValueChange };

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <View ref={ref} style={[styles.container, style]} accessibilityRole="radiogroup">
          {children}
        </View>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = forwardRef<View, RadioGroupItemProps>(
  ({ value: itemValue, style, disabled, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useRadioGroup();
    const isSelected = selectedValue === itemValue;

    return (
      <TouchableOpacity
        ref={ref}
        style={[
          styles.radio,
          isSelected && styles.radioSelected,
          disabled && styles.itemDisabled,
          style,
        ]}
        onPress={() => onValueChange(itemValue)}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityState={{ checked: isSelected, disabled }}
        {...props}
      >
        {isSelected && <View style={styles.radioInner} />}
      </TouchableOpacity>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
