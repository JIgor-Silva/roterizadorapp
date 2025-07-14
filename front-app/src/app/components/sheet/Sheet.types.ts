import React from 'react';
import { ViewProps, TextProps, Animated } from 'react-native';

export type Side = "top" | "bottom" | "left" | "right";

export interface SheetContextValue {
  visible: boolean;
  open: () => void;
  close: () => void;
}

export interface SheetProps {
  children: React.ReactNode;
}

export interface SheetTriggerProps {
  children: React.ReactNode;
}

export interface SheetCloseProps extends ViewProps {}

export interface SheetContentProps extends ViewProps {
  side?: Side;
  children: React.ReactNode;
}

export interface SheetOverlayProps {
  onPress: () => void;
  animationValue: Animated.Value;
}

export interface SheetHeaderProps extends ViewProps {}

export interface SheetFooterProps extends ViewProps {}

export interface SheetTitleProps extends TextProps {}

export interface SheetDescriptionProps extends TextProps {}
