import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  type ViewProps, 
  type ViewStyle, 
  type TextStyle  
} from 'react-native';
import { BadgeProps } from './Badge.types';
import styles from './Badge.styles';


const Badge = React.forwardRef<View, BadgeProps>(
  ({ variant = 'default', children, style, ...props }, ref) => {
    
    const variantStyles = useMemo(() => ({
      container: styles[`${variant}Container`],
      text: styles[`${variant}Text`],
    }), [variant]);

    return (
      <View
        ref={ref}
        style={[styles.baseContainer, variantStyles.container, style]}
        {...props}
      >
        <Text style={[styles.baseText, variantStyles.text]}>
          {children}
        </Text>
      </View>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, BadgeProps };
