import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { SkeletonProps } from './Skeleton.types';
import { styles } from './Skeleton.styles';

const Skeleton = React.forwardRef<View, SkeletonProps>(
  ({ style, ...props }, ref) => {
    const opacity = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.9,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, [opacity]);

    return (
      <Animated.View
        ref={ref}
        style={[
          styles.base,
          style,
          { opacity },
        ]}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
