import React from 'react';
import { ViewProps, TextProps, ColorValue } from 'react-native';

export type AlertVariant = 'default' | 'destructive';

export type AlertContextValue = {
  variant: AlertVariant;
};

export type AlertProps = ViewProps & {
  variant?: AlertVariant;
  children: React.ReactNode;
};
