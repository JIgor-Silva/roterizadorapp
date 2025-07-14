import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { styles, themeColors } from './Textarea.styles';
import { TextareaProps } from './Textarea.types';

const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ style, editable = true, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus: TextareaProps['onFocus'] = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur: TextareaProps['onBlur'] = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <TextInput
        ref={ref}
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        multiline={true}
        style={[
          styles.base,
          !editable && styles.disabled,
          isFocused && styles.focused,
          style,
        ]}
        placeholderTextColor={themeColors.mutedForeground}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
