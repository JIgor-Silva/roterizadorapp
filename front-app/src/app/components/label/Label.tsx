import * as React from 'react';
import { Text, StyleSheet, type TextProps } from 'react-native';
import { styles } from './Label.styles';
import { LabelProps } from './Label.types';

const Label = React.forwardRef<Text, LabelProps>(
  ({ children, disabled = false, style, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        style={[
          styles.label,
          disabled && styles.labelDisabled,
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
Label.displayName = 'Label';

export { Label };
