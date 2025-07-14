import React from 'react';
import {
  Pressable,
  View,
  type PressableStateCallbackType
} from 'react-native';
import { Check, Minus } from 'lucide-react-native';
import { CheckboxProps } from './Checkbox.types';
import styles from './Checkbox.styles';

const Checkbox = React.forwardRef<View, CheckboxProps>(
  ({ checked, onValueChange, disabled = false, style, ...props }, ref) => {

    const handlePress = () => {
      if (disabled || !onValueChange) return;
      onValueChange(checked === 'indeterminate' ? true : !checked);
    };

    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        style={(state: PressableStateCallbackType) => [
          styles.container,
          checked && styles.containerChecked,
          disabled && styles.containerDisabled,
          style,
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: checked === 'indeterminate' ? 'mixed' : checked, disabled }}
        {...props}
      >
        <View style={styles.indicator}>
          {checked === true && (
            <Check size={14} color="#000000" strokeWidth={3} />
          )}
          {checked === 'indeterminate' && (
            <Minus size={14} color="#000000" strokeWidth={3} />
          )}
        </View>
      </Pressable>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
