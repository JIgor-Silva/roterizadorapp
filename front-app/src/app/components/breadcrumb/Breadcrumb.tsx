import * as React from 'react';
import { View, Text, Pressable, type ViewProps, type TextProps, type PressableProps } from 'react-native';
import { ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { clsx } from 'clsx';
import { themeColors } from '../../styles/theme';
import { BreadcrumbProps, BreadcrumbLinkProps, BreadcrumbPageProps, BreadcrumbEllipsisProps } from './Breadcrumb.types';
import styles from './Breadcrumb.styles';

const BreadcrumbContext = React.createContext<{ separator?: React.ReactNode }>({
  separator: undefined,
});

const Breadcrumb = React.forwardRef<
  View,
  BreadcrumbProps
>(({ separator = <ChevronRight size={16} color={themeColors.mutedForeground} />, className, style, ...props }, ref) => (
  <BreadcrumbContext.Provider value={{ separator }}>
    <View ref={ref} className={clsx(className)} style={style} accessibilityLabel="breadcrumb" {...props} />
  </BreadcrumbContext.Provider>
));
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<View, ViewProps>(({ className, style, children, ...props }, ref) => {
  const { separator } = React.useContext(BreadcrumbContext);

  const items = React.Children.toArray(children);
  const itemsWithSeparators = items.map((child, index) => (
    <React.Fragment key={index}>
      {child}
      {index < items.length - 1 && separator}
    </React.Fragment>
  ));

  return (
    <View ref={ref} className={clsx("flex-row flex-wrap items-center gap-2", className)} style={style} {...props}>
      {itemsWithSeparators}
    </View>
  );
});
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<View, ViewProps>(({ className, style, ...props }, ref) => {
  return <View ref={ref} className={clsx("flex-row items-center gap-1.5", className)} style={style} {...props} />;
});
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<
  View,
  BreadcrumbLinkProps
>(({ children, className, style, ...props }, ref) => {
  return (
    <Pressable
      ref={ref}
      className={clsx("text-sm text-zinc-600", className)}
      style={style}
      {...props}
    >
      {({ pressed }) => (
        <Text style={[styles.textStyle, { color: pressed ? themeColors.foreground : themeColors.mutedForeground }]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<Text, BreadcrumbPageProps>(({ className, style, ...props }, ref) => {
  return (
    <Text
      ref={ref}
      role="link"
      accessibilityState={{ disabled: true }}
      className={clsx("text-sm font-normal text-zinc-900", className)}
      style={[styles.textStyle, style]}
      {...props}
    />
  );
});
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = React.forwardRef<View, ViewProps>(({ className, style, ...props }, ref) => (
  <View ref={ref} role="presentation" className={clsx(className)} style={style} {...props} />
));
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = React.forwardRef<
  View,
  BreadcrumbEllipsisProps
>(({ className, style, ...props }, ref) => (
  <Pressable
    ref={ref}
    className={clsx("flex h-9 w-9 items-center justify-center", className)}
    style={style}
    {...props}
  >
    <MoreHorizontal size={16} color={themeColors.foreground} />
    <Text style={[styles.textStyle, { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', borderWidth: 0 }]}>More</Text>
  </Pressable>
));
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
