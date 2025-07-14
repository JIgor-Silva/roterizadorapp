import { ViewProps, TouchableOpacityProps } from 'react-native';

export interface TabsProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface TabsListProps extends ViewProps {
  activeTab?: string;
  onTabPress?: (value: string) => void;
  children: React.ReactNode;
}

export interface TabsTriggerProps extends TouchableOpacityProps {
  value: string;
  activeTab?: string;
  onTabPress?: (value: string) => void;
  children: React.ReactNode;
}

export interface TabsContentProps extends ViewProps {
  value: string;
  activeTab?: string;
  children: React.ReactNode;
}
