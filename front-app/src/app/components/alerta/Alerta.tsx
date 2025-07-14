import React, { createContext, useContext } from 'react';
import { View, Text, ViewProps, TextProps, ColorValue } from 'react-native';
import { clsx } from 'clsx'; 
import { AlertContextValue, AlertProps, AlertVariant } from './Alerta.types';
import styles from './Alerta.styles';

const alertVariants = {
  default: {
    container: "bg-white border-zinc-200",
    title: "text-zinc-900",
    description: "text-zinc-700",
    icon: "text-zinc-900", 
  },
  destructive: {
    container: "border-red-500/50 bg-red-50",
    title: "text-red-700",
    description: "text-red-600",
    icon: "text-red-500",
  },
};

const AlertContext = createContext<AlertContextValue | null>(null);

const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert deve ser usado dentro de um <Alert>');
  }
  return context;
};


export const Alert = React.forwardRef<View, AlertProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const icon = childrenArray.find(
      (child) => React.isValidElement(child) && (child.type as any).displayName?.includes('Icon')
    );
    const content = childrenArray.filter((child) => child !== icon);

    const variantClasses = alertVariants[variant];

    return (
      <AlertContext.Provider value={{ variant }}>
        <View
          ref={ref}
          className={clsx(
            "relative w-full rounded-lg border p-4",
            icon ? "pl-11" : "pl-4",
            variantClasses.container,
            className
          )}
          {...props}
        >
          {icon && (
            <View className="absolute left-4 top-4">
              {React.cloneElement(
                icon as React.ReactElement<{ color?: ColorValue; size?: number, className?: string }>,
                {
                  className: variantClasses.icon,
                  size: 20,
                }
              )}
            </View>
          )}
          <View>
            {content}
          </View>
        </View>
      </AlertContext.Provider>
    );
  }
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<Text, TextProps>(
  ({ children, className, ...props }, ref) => {
    const { variant } = useAlert();
    return (
      <Text
        ref={ref}
        style={styles.textStyle}
        className={clsx(
          "mb-1 font-medium tracking-tight text-base",
          alertVariants[variant].title,
          className
        )}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<Text, TextProps>(
  ({ children, className, ...props }, ref) => {
    const { variant } = useAlert();
    return (
      <Text
        ref={ref}
        style={styles.textStyle}
        className={clsx(
          "text-sm",
          alertVariants[variant].description,
          className
        )}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
AlertDescription.displayName = "AlertDescription";
