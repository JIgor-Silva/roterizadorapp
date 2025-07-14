import React from 'react';
import { Switch as RNSwitch } from 'react-native';
import { PRIMARY_COLOR, INPUT_COLOR, THUMB_COLOR_ON, THUMB_COLOR_OFF } from './Switch.styles';
import { SwitchProps } from './Switch.types';

const Switch = React.forwardRef<RNSwitch, SwitchProps>((
  {
    style,
    value, 
    onValueChange,
    disabled,
    ...props
  }, 
  ref
) => {
  return (
    <RNSwitch
      ref={ref}
      style={style}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: INPUT_COLOR, true: PRIMARY_COLOR }}
      thumbColor={value ? THUMB_COLOR_ON : THUMB_COLOR_OFF}
      ios_backgroundColor={INPUT_COLOR}
      {...props}
    />
  );
});

Switch.displayName = 'Switch';

export { Switch };
