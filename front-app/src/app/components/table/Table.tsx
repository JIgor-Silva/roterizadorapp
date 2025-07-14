import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { styles } from './Table.styles';
import { TableProps, TableHeaderProps, TableBodyProps, TableFooterProps, TableRowProps, TableHeadProps, TableCellProps, TableCaptionProps } from './Table.types';

const Table = React.forwardRef<ScrollView, TableProps>(
  ({ style, children, ...props }, ref) => (
    <View style={styles.tableWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View ref={ref as React.Ref<any>} style={[styles.table, style]} {...props}>
                {children}
            </View>
        </ScrollView>
    </View>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<View, TableHeaderProps>(
  ({ style, ...props }, ref) => <View ref={ref} style={[styles.header]} {...props} />
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<View, TableBodyProps>(
  ({ children, ...props }, ref) => {
    const childCount = React.Children.count(children);
    return (
        <View ref={ref} {...props}>
            {React.Children.map(children, (child, index) =>
                React.isValidElement(child)
                ? React.cloneElement(child, { isLast: index === childCount - 1 } as any)
                : child
            )}
        </View>
    )
  }
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<View, TableFooterProps>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.footer, style]} {...props} />
  )
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<View, TableRowProps>(
  ({ isSelected, isLast, style, ...props }, ref) => (
    <Pressable
      ref={ref}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed,
        isSelected && styles.rowSelected,
        isLast && styles.rowLast,
        style,
      ]}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<View, TableHeadProps>(
  ({ style, children, ...props }, ref) => (
    <View ref={ref} style={[styles.cell, styles.head, style]} {...props}>
      {typeof children === 'string' ? <Text style={styles.headText}>{children}</Text> : children}
    </View>
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<View, TableCellProps>(
  ({ style, children, ...props }, ref) => (
    <View ref={ref} style={[styles.cell, style]} {...props}>
      {typeof children === 'string' ? <Text style={styles.cellText}>{children}</Text> : children}
    </View>
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<Text, TableCaptionProps>(
  ({ style, ...props }, ref) => (
    <Text ref={ref} style={[styles.caption, style]} {...props} />
  )
);
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
