import React, { useEffect, useRef } from 'react';
import { View, Animated, type ViewProps } from 'react-native';
import { styles } from './Progress.styles';
import type { ProgressProps } from './Progress.types';

const Progress = React.forwardRef<View, ProgressProps>(
  ({ value, animationDuration = 300, ...props }, ref) => {
    const clampedValue = Math.min(Math.max(value || 0, 0), 100);

    const progressAnimation = useRef(new Animated.Value(clampedValue)).current;
    useEffect(() => {
      Animated.timing(progressAnimation, {
        toValue: clampedValue,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    }, [clampedValue, animationDuration, progressAnimation]);

    const animatedWidth = progressAnimation.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp',
    });

    return (
      <View
        ref={ref}
        style={styles.container}
        accessibilityRole="progressbar"
        accessibilityLabel="Barra de progresso"
        accessibilityValue={{ min: 0, max: 100, now: clampedValue }}
        {...props}
      >
        <Animated.View style={[styles.bar, { width: animatedWidth }]} />
      </View>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
