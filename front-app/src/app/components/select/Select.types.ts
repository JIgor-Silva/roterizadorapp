import React from 'react';
import { ViewProps, ScrollViewProps, TextProps } from 'react-native';

export interface SelectContextValue {
  value?: string;
  onValueChange: (value: string) => void;
  options: Map<string, React.ReactNode>;
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export interface SelectTriggerProps extends ViewProps {}

export interface SelectValueProps {
  placeholder?: string;
}

export interface SelectContentProps {
  children: React.ReactNode;
  style?: ViewProps['style'];
}

export interface SelectLabelProps {
  children: React.ReactNode;
}

export interface SelectSeparatorProps extends ViewProps {}
