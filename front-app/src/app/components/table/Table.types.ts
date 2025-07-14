import { ViewProps, TextProps } from 'react-native';

export interface TableRowProps extends ViewProps {
  isSelected?: boolean;
  isLast?: boolean;
}

export interface TableProps extends ViewProps {}
export interface TableHeaderProps extends ViewProps {}
export interface TableBodyProps extends ViewProps {}
export interface TableFooterProps extends ViewProps {}
export interface TableHeadProps extends ViewProps {}
export interface TableCellProps extends ViewProps {}
export interface TableCaptionProps extends TextProps {}
