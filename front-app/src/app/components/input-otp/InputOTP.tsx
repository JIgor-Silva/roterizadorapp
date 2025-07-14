import React, { createContext, useContext, forwardRef, useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  type ViewProps,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from 'react-native';
import { styles } from './InputOTP.styles';
import {
  InputOTPProps,
  InputOTPContextValue,
} from './InputOTP.types';

const InputOTPContext = createContext<InputOTPContextValue | null>(null);

const useOTP = () => {
  const context = useContext(InputOTPContext);
  if (!context) {
    throw new Error('useOTP deve ser usado dentro de um <InputOTP>');
  }
  return context;
};

const InputOTP = forwardRef<View, InputOTPProps>(
  ({ maxLength = 6, value: controlledValue, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(controlledValue ? controlledValue.split('') : new Array(maxLength).fill(''));
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    
    useEffect(() => {
        if (controlledValue !== undefined) {
            setInternalValue(controlledValue.split(''));
        }
    }, [controlledValue]);

    const handleTextChange = (text: string, index: number) => {
        const newValue = [...internalValue];
        newValue[index] = text;
        setInternalValue(newValue);
        onValueChange?.(newValue.join(''));

        // Foco automático para o próximo input
        if (text && index < maxLength - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    
    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !internalValue[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const contextValue = {
        value: internalValue,
        setValue: setInternalValue,
        maxLength,
        focusedIndex,
        setFocusedIndex,
        handleTextChange,
        handleKeyPress,
    };

    return (
      <InputOTPContext.Provider value={contextValue}>
        <View ref={ref} {...props}>
          {/* A ref para cada TextInput será atribuída dentro do InputOTPSlot */}
          <TextInput
            ref={(el) => { inputRefs.current[0] = el; }}
            style={styles.hiddenInput}
            maxLength={maxLength}
            value={internalValue.join('')}
            onChangeText={(text) => {
                const newArr = text.padEnd(maxLength, ' ').split('').slice(0, maxLength);
                setInternalValue(newArr.map(c => c.trim()));
                onValueChange?.(newArr.join('').trim());
            }}
            keyboardType="numeric"
          />
          {children}
        </View>
      </InputOTPContext.Provider>
    );
  }
);
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.group, style]} {...props} />
));
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = (props: { index: number; style?: StyleProp<ViewStyle> }) => {
  const { value, focusedIndex, setFocusedIndex, handleTextChange, handleKeyPress } = useOTP();
  const inputRef = useRef<TextInput>(null);
  const character = value[props.index] || '';
  const isActive = focusedIndex === props.index;

  return (
    <View style={[styles.slot, isActive && styles.slotActive, props.style]}>
      <Text style={styles.slotText}>{character}</Text>
      <TextInput
        ref={inputRef}
        style={styles.slotInput}
        maxLength={1}
        value={character}
        onChangeText={(text) => handleTextChange(text, props.index)}
        onKeyPress={(e) => handleKeyPress(e, props.index)}
        onFocus={() => setFocusedIndex(props.index)}
        onBlur={() => setFocusedIndex(-1)}
        keyboardType="numeric"
      />
    </View>
  );
};
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.separator, style]} {...props}>
    <Text style={styles.separatorText}>-</Text>
  </View>
));
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
