import React from 'react';
import { View, Text, StyleSheet, Platform, type ViewProps, type TextProps } from 'react-native';
import { clsx } from 'clsx';
import { themeColors } from '../../styles/theme';
import { CardProps, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps } from './Card.types';
import cardStyles from './Card.styles';

const CardRoot = React.forwardRef<View, CardProps>(
  ({ className, style, ...props }, ref) => (
    <View
      ref={ref}
      className={clsx("rounded-xl border bg-card text-card-foreground shadow-sm", className)}
      style={[cardStyles.cardShadow, style]}
      {...props}
    />
  )
);
CardRoot.displayName = "Card";

const CardHeader = React.forwardRef<View, CardHeaderProps>(
  ({ className, style, ...props }, ref) => (
    <View
      ref={ref}
      className={clsx("flex flex-col space-y-1.5 p-6", className)}
      style={style}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<Text, CardTitleProps>(
  ({ className, style, ...props }, ref) => (
    <Text
      ref={ref}
      className={clsx("text-2xl font-semibold leading-none tracking-tight", className)}
      style={[styles.textStyle, cardStyles.cardTitleColor, style]}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<Text, CardDescriptionProps>(
  ({ className, style, ...props }, ref) => (
    <Text
      ref={ref}
      className={clsx("text-sm text-muted-foreground", className)}
      style={[styles.textStyle, cardStyles.cardDescriptionColor, style]}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<View, CardContentProps>(
  ({ className, style, ...props }, ref) => (
    <View
      ref={ref}
      className={clsx("p-6 pt-0", className)} // p-6 pt-0
      style={style}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<View, CardFooterProps>(
  ({ className, style, ...props }, ref) => (
    <View
      ref={ref}
      className={clsx("flex flex-row items-center p-6 pt-0", className)}
      style={style}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

const styles = StyleSheet.create({
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardTitleColor: {
    color: themeColors.cardForeground,
  },
  cardDescriptionColor: {
    color: themeColors.mutedForeground,
  },
  textStyle: {
    
  }
});

export {
  CardRoot as Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
