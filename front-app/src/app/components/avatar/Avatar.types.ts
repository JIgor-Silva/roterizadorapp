import React from 'react';
import { ViewProps, ImageProps } from 'react-native';

export interface AvatarProps extends ViewProps {
  children: React.ReactNode;
  size?: number;
}
