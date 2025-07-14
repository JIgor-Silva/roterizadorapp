import React, { createContext, forwardRef, useContext, useMemo } from 'react';
import { View, Text, Platform, StyleSheet, type ViewProps, type TextStyle, type ViewStyle } from 'react-native';
import {
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryLine,
} from 'victory';
import { clsx } from 'clsx';
import { themeColors } from '../../styles/theme';
import { ChartConfig, ChartContextValue, ChartContainerProps, ChartTooltipContentProps, ChartLegendContentProps, ChartDatum } from './Chart.types';
import styles from './Chart.styles';
import { Button } from '../button/Button';

const ChartContext = createContext<ChartContextValue | null>(null);

function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart deve ser usado dentro de um <ChartContainer />");
  }
  return context;
}

const ChartContainer = forwardRef<View, ChartContainerProps>(
  ({ config, children, className, style, ...props }, ref) => {
    const resolvedColors = useMemo(() => {
      return Object.keys(config).reduce((acc, key) => {
        if (config[key].color) {
          acc[key] = config[key].color!;
        }
        return acc;
      }, {} as { [key: string]: string });
    }, [config]);

    const contextValue = {
      config,
      resolvedColors,
    };

    return (
      <ChartContext.Provider value={contextValue}>
        <View ref={ref} className={clsx("w-full", className)} style={style} {...props}>
          {children}
        </View>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

const ChartTooltipContent = ({
  datum,
  label,
  indicator = 'dot',
  hideIndicator = false,
  hideLabel = false,
  labelStyle,
  valueStyle,
  className, // Recebe className
  style,
}: ChartTooltipContentProps) => {
  const { config, resolvedColors = {} } = useChart();

  if (!datum) {
    return null;
  }

  const items = Object.keys(datum)
    .filter(
      (key) =>
        key !== '_x' &&
        key !== '_y' &&
        key !== '_voronoiX' &&
        key !== '_voronoiY' &&
        key !== 'childName' &&
        key !== '_eventCount' &&
        typeof datum[key] !== 'object'
    )
    .map((key) => {
      const itemConfig = config[key] || {};
      const color =
        resolvedColors[key] ||
        itemConfig.color ||
        VictoryTheme.material.group?.colorScale?.[0] ||
        '#8884d8';
      return {
        name: itemConfig.label || key,
        value: datum[key],
        color,
        icon: itemConfig.icon,
      };
    })
    .filter((item) => item.value !== undefined && item.value !== null);

  if (items.length === 0) {
    return null;
  }

  return (
    <View
      className={clsx("p-2 bg-white rounded-md", className)}
      style={[
        styles.tooltipShadow,
        style,
      ]}
    >
      {!hideLabel && label && (
        <Text style={[styles.textStyle, labelStyle]} className="text-base font-bold mb-1 text-zinc-800">{label}</Text>
      )}
      {items.map((item, index) => (
        <View key={index} className="flex-row items-center mb-0.5">
          {!hideIndicator && (
            <View
              className={clsx(
                "w-2.5 h-2.5 rounded-full mr-1.5",
                indicator === 'line' && "h-0.5 rounded-none",
                indicator === 'dashed' && "h-0.5 rounded-none"
              )}
              style={{ backgroundColor: item.color }}
            />
          )}
          {item.icon && (
            <item.icon
              style={{ color: item.color, width: 12, height: 12, marginRight: 4 }}
            />
          )}
          <Text style={[styles.textStyle, valueStyle]} className="text-sm text-zinc-600 mr-1">
            {item.name}:
          </Text>
          <Text style={[styles.textStyle, valueStyle]} className="text-sm font-bold text-zinc-800">
            {typeof item.value === 'number'
              ? item.value.toLocaleString()
              : item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegendContent = forwardRef<
  View,
  ChartLegendContentProps & { className?: string }
>(({ data, className, style, ...props }, ref) => {
  const { config, resolvedColors = {} } = useChart();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View ref={ref} className={clsx("flex-row flex-wrap justify-center items-center py-2", className)} style={style} {...props}>
      {data.map((item: any, index: number) => { // Assuming 'any' for now, can refine if Chart.types.ts is available
        const key = item.name;
        const itemConfig = config[key] || {};
        const color =
          resolvedColors[key] ||
          itemConfig.color ||
          item.symbol?.fill ||
          VictoryTheme.material.legend?.colorScale?.[index] ||
          '#8884d8';
        const Icon = itemConfig.icon;

        return (
          <View key={index} className="flex-row items-center mx-2 my-1">
            {Icon ? (
              <Icon
                style={{ color, width: 12, height: 12, marginRight: 4 }}
              />
            ) : (
              <View
                className="w-2.5 h-2.5 rounded-sm mr-1.5"
                style={{ backgroundColor: color }}
              />
            )}
            <Text style={styles.textStyle} className="text-sm text-zinc-800">{itemConfig.label || key}</Text>
          </View>
        );
      })}
    </View>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

const ChartLegend = (props: ChartLegendContentProps) => {
  return <ChartLegendContent {...props} />;
};
ChartLegend.displayName = "ChartLegend";

export {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  useChart,
  VictoryChart,
  VictoryLine,
  VictoryVoronoiContainer,
};
