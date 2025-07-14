import { ViewProps, TextInputProps, StyleProp, ViewStyle, TextStyle, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

export interface InputOTPContextValue {
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  maxLength: number;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  handleTextChange: (text: string, index: number) => void;
  handleKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => void;
}

export interface InputOTPProps extends ViewProps {
  maxLength?: number;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}
