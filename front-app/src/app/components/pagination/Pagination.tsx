import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  type ViewProps, 
  type TextProps, 
  type PressableProps,
  type PressableStateCallbackType
} from 'react-native';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { styles } from './Pagination.styles';
import type { PaginationProps } from './Pagination.types';

const Pagination = ({ style, ...props }: ViewProps) => (
  <View style={[styles.nav, style]} {...props} />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.container, style]} {...props} />
  )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<View, ViewProps>(
  (props, ref) => <View ref={ref} {...props} />
);
PaginationItem.displayName = "PaginationItem";


interface PaginationLinkProps extends PressableProps {
  isActive?: boolean;
  children: React.ReactNode;
}

const PaginationLink = ({ isActive, children, style, ...props }: PaginationLinkProps) => (
  <Pressable
    accessibilityState={{ selected: isActive }}
    style={(state: PressableStateCallbackType) => [
      styles.linkBase,
      isActive ? styles.linkActive : styles.linkGhost,
      state.pressed && styles.linkPressed,
      typeof style === 'function' ? style(state) : style,
    ]}
    {...props}
  >
    <Text style={[styles.linkText, isActive && styles.linkTextActive]}>{children}</Text>
  </Pressable>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ style, ...props }: PressableProps) => (
    <Pressable
        style={(state: PressableStateCallbackType) => [
            styles.linkBase,
            styles.linkGhost,
            styles.prevNext,
            state.pressed && styles.linkPressed,
            typeof style === 'function' ? style(state) : style,
        ]}
        {...props}
    >
        <ChevronLeft size={16} />
        <Text style={styles.linkText}>Anterior</Text>
    </Pressable>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ style, ...props }: PressableProps) => (
    <Pressable
        style={(state: PressableStateCallbackType) => [
            styles.linkBase,
            styles.linkGhost,
            styles.prevNext,
            state.pressed && styles.linkPressed,
            typeof style === 'function' ? style(state) : style,
        ]}
        {...props}
    >
        <Text style={styles.linkText}>Próximo</Text>
        <ChevronRight size={16} />
    </Pressable>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ style, ...props }: ViewProps) => (
  <View style={[styles.ellipsis, style]} {...props}>
    <MoreHorizontal size={16} />
  </View>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
};
