import React from 'react';
import { ViewProps, TextStyle, ViewStyle, View } from 'react-native';
import { VictoryTooltip } from 'victory';

export type ChartConfig = {
  [key: string]: {
    label?: string;
    color?: string;
    icon?: React.ComponentType<{ style?: TextStyle }>;
  };
};

export interface ChartDatum {
  [key: string]: number | string | undefined;
  _x?: number;
  _y?: number;
  _voronoiX?: number;
  _voronoiY?: number;
  childName?: string;
  _eventCount?: number;
  fill?: string;
}

export type ChartContextValue = {
  config: ChartConfig;
  resolvedColors?: { [key: string]: string };
};

export type ChartContainerProps = React.ComponentProps<typeof View> & {
  config: ChartConfig;
  children: React.ReactNode;
};

export type ChartTooltipContentProps = React.ComponentProps<typeof VictoryTooltip> & {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  style?: ViewStyle;
  datum?: ChartDatum; 
  label?: string;
  className?: string;
};

export type ChartLegendContentProps = React.ComponentProps<typeof View> & {
  data?: Array<{
    name: string;
    symbol?: { fill?: string; type?: string };
    labels?: { fill?: string };
  }>;
};
