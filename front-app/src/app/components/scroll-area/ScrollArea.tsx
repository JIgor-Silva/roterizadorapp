import React from 'react';
import { ScrollView, View } from 'react-native';

import { styles } from './ScrollArea.styles';
import { ScrollAreaProps } from './ScrollArea.types';

const ScrollArea = React.forwardRef<ScrollView, ScrollAreaProps>((
  {
    style,
    children,
    showsVerticalScrollIndicator = true,
    showsHorizontalScrollIndicator = true,
    indicatorStyle,
    ...props
  },
  ref
) => {
  return (
    <View style={[styles.outerContainer, style]}>
      <ScrollView
        ref={ref}
        style={styles.scrollView}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        indicatorStyle={indicatorStyle}
        {...props}
      >
        {children}
      </ScrollView>
    </View>
  );
});
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
