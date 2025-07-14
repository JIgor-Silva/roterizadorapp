import * as React from 'react';
import { ViewProps, TextProps, PressableProps } from 'react-native';

export interface BreadcrumbProps extends ViewProps {
  separator?: React.ReactNode;
}

export interface BreadcrumbLinkProps extends PressableProps {
  children?: React.ReactNode;
}

export interface BreadcrumbPageProps extends TextProps {}

export interface BreadcrumbEllipsisProps extends PressableProps {}
