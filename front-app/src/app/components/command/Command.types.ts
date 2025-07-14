
import { ViewProps, TextProps, TextInputProps, SectionListProps, PressableProps } from 'react-native';

export type CommandItemType = { id: string; label: string; [key: string]: any };

export interface CommandSection {
  heading: string;
  items: Array<CommandItemType>;
}

export interface CommandContextValue {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredSections: CommandSection[];
  onSelect?: (item: CommandItemType) => void;
}

export interface CommandProps extends ViewProps {
  sections: CommandSection[];
  onSelect?: (item: CommandItemType) => void;
}
