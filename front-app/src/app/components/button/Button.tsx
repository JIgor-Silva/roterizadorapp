import React, { useMemo } from 'react';
import {
  Pressable,
  Text,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
  type ColorValue,
  type PressableStateCallbackType,
  View,
} from 'react-native';
import { clsx } from 'clsx'; 
import { themeColors } from '../../styles/theme';
import { ButtonProps } from './Button.types';
import styles from './Button.styles';

const buttonVariants = {
  baseContainer: "flex-row items-center justify-center rounded-md gap-2",
  baseText: "text-sm font-medium",
  variants: {
    default: {
      container: "bg-zinc-900",
      text: "text-zinc-50",
      pressed: "bg-zinc-900/90",
    },
    destructive: {
      container: "bg-red-500",
      text: "text-zinc-50",
      pressed: "bg-red-500/90",
    },
    outline: {
      container: "border border-zinc-200 bg-transparent",
      text: "text-zinc-950",
      pressed: "bg-zinc-100",
    },
    secondary: {
      container: "bg-zinc-100",
      text: "text-zinc-900",
      pressed: "bg-zinc-100/80",
    },
    ghost: {
      container: "bg-transparent",
      text: "text-zinc-950",
      pressed: "bg-zinc-100",
    },
    link: {
      container: "bg-transparent",
      text: "text-zinc-900 underline",
      pressed: "opacity-80",
    },
  },
  sizes: {
    default: {
      container: "h-10 px-4 py-2",
    },
    sm: {
      container: "h-9 px-3",
    },
    lg: {
      container: "h-11 px-8",
    },
    icon: {
      container: "h-10 w-10",
    },
  },
};

const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      asChild = false,
      children,
      className,
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses = buttonVariants.variants[variant];
    const sizeClasses = buttonVariants.sizes[size];
    const textStyle = useMemo(() => {
      const styles: TextStyle[] = [];
      if (variantClasses.text.includes('text-zinc-50')) {
        styles.push({ color: themeColors.primaryForeground });
      } else if (variantClasses.text.includes('text-zinc-950')) {
        styles.push({ color: themeColors.foreground });
      } else if (variantClasses.text.includes('text-red-500')) {
        styles.push({ color: themeColors.destructiveForeground });
      } else if (variantClasses.text.includes('text-zinc-900')) {
        styles.push({ color: themeColors.secondaryForeground });
      } else {
        styles.push({ color: themeColors.foreground }); // Fallback
      }

      if (variantClasses.text.includes('underline')) {
        styles.push({ textDecorationLine: 'underline' });
      }
      return styles;
    }, [variant]);

    const combinedClasses = clsx(
      buttonVariants.baseContainer,
      variantClasses.container,
      sizeClasses.container,
      disabled && "opacity-50",
      className
    );

    const pressedStyle = (state: PressableStateCallbackType) => {
      if (state.pressed && variantClasses.pressed) {
        if (variantClasses.pressed.includes('bg-zinc-900/90')) return { backgroundColor: 'rgba(24, 24, 27, 0.9)' };
        if (variantClasses.pressed.includes('bg-red-500/90')) return { backgroundColor: 'rgba(239, 68, 68, 0.9)' };
        if (variantClasses.pressed.includes('bg-zinc-100')) return { backgroundColor: themeColors.accent };
        if (variantClasses.pressed.includes('bg-zinc-100/80')) return { backgroundColor: 'rgba(244, 244, 245, 0.8)' };
        if (variantClasses.pressed.includes('opacity-80')) return { opacity: 0.8 };
      }
      return {};
    };

    if (asChild) {
      const child = React.Children.only(children);
      if (React.isValidElement(child)) {
        return React.cloneElement(
          child as React.ReactElement<
            PressableProps & { className?: string; style?: ViewStyle | ((state: PressableStateCallbackType) => ViewStyle) }
          >,
          {
            ...props,
            disabled,
            className: combinedClasses,
            style: (state: PressableStateCallbackType) => [
              typeof style === 'function' ? style(state) : style,
              pressedStyle(state)
            ],
          }
        );
      }
    }

    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        className={combinedClasses}
        style={(state: PressableStateCallbackType) => [
          typeof style === 'function' ? style(state) : style,
          pressedStyle(state)
        ]}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (typeof child === 'string') {
            return <Text style={[styles.textStyle, ...textStyle]} className={buttonVariants.baseText}>{child}</Text>;
          }

          if (React.isValidElement(child)) {
            const typedChild = child as React.ReactElement<{ color?: ColorValue; size?: number; className?: string }>;
            return React.cloneElement(
              typedChild,
              {
                color: variantClasses.text.includes('text-zinc-50') ? themeColors.primaryForeground :
                       variantClasses.text.includes('text-red-500') ? themeColors.destructiveForeground :
                       variantClasses.text.includes('text-zinc-900') ? themeColors.secondaryForeground :
                       themeColors.foreground,
                size: typedChild.props.size || 16, 
                className: clsx(typedChild.props.className),
              }
            );
          }
          return child;
        })}
      </Pressable>
    );
  }
);
Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
