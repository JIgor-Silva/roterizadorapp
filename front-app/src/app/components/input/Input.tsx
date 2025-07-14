import React, { useState, forwardRef } from 'react';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { styles } from './Input.styles';
import { InputProps } from './Input.types';

const Input = forwardRef<TextInput, InputProps>(
  ({ style, editable = true, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus: TextInputProps['onFocus'] = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur: TextInputProps['onBlur'] = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <TextInput
        ref={ref}
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.base,
          !editable && styles.disabled,
          isFocused && styles.focused,
        ]}
        placeholderTextColor={styles.placeholderTextColor.color}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
