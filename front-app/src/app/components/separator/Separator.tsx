import React from 'react';
import { View } from 'react-native';
import { SeparatorProps } from './Separator.types';
import { styles } from './Separator.styles';

const Separator = React.forwardRef<View, SeparatorProps>((
  {
    style,
    orientation = 'horizontal',
    decorative = true,
    ...props
  },
  ref
) => {
  const accessibilityProps = decorative ? { accessible: false } : {};

  return (
    <View
      ref={ref}
      style={[
        styles.base,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
      {...accessibilityProps}
      {...props}
    />
  );
});

Separator.displayName = 'Separator';

export { Separator };
