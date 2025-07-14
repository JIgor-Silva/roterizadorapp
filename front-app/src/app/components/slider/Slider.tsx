import React from 'react';
import { View, Animated } from 'react-native';
import RNSlider from '@react-native-community/slider';
import { styles, PRIMARY_COLOR_CONST, SECONDARY_COLOR_CONST, THUMB_COLOR_CONST } from './Slider.styles';
import { SliderProps, SliderRef } from './Slider.types';

const Slider = React.forwardRef<SliderRef, SliderProps>(
  (
    {
      style,
      value,
      defaultValue,
      onValueChange,
      step = 1,
      min = 0,
      max = 100,
      disabled = false,
      ...props
    },
    ref
  ) => {

  const handleValueChange = (newValue: number) => {
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  const initialValue = defaultValue !== undefined ? defaultValue : value;
  
  return (
    <View style={[styles.container, style]}>
      <RNSlider
        ref={ref as any}
        style={styles.slider}
        value={initialValue}
        onValueChange={handleValueChange}
        step={step}
        minimumValue={min}
        maximumValue={max}
        disabled={disabled}
        minimumTrackTintColor={PRIMARY_COLOR_CONST}
        maximumTrackTintColor={SECONDARY_COLOR_CONST}
        thumbTintColor={THUMB_COLOR_CONST}
        {...props}
      />
    </View>
  );
});

Slider.displayName = 'Slider';

export { Slider };
