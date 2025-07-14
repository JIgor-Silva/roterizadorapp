import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SectionList,
  Pressable,
  Modal,
  type ViewProps,
  type TextInputProps,
  type SectionListProps,
  type PressableProps,
  PressableStateCallbackType,
  TextProps,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { styles } from './Command.styles';
import {
  CommandItemType,
  CommandSection,
  CommandContextValue,
  CommandProps,
} from './Command.types';
import { themeColors } from '@/app/styles/theme';

const CommandContext = createContext<CommandContextValue | null>(null);

const useCommand = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommand deve ser usado dentro de um <Command>');
  }
  return context;
};

const Command = React.forwardRef<View, CommandProps>(
  ({ sections, onSelect, style, ...props }, ref) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSections = useMemo(() => {
      if (!searchQuery) {
        return sections;
      }
      return sections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((section) => section.items.length > 0);
    }, [searchQuery, sections]);

    const contextValue = { searchQuery, setSearchQuery, filteredSections, onSelect };

    return (
      <CommandContext.Provider value={contextValue}>
        <View ref={ref} style={[styles.command, style]} {...props}>
          <CommandInput />
          <CommandList />
        </View>
      </CommandContext.Provider>
    );
  }
);
Command.displayName = 'Command';

const CommandDialog = ({
  sections,
  onSelect,
  open,
  onOpenChange,
}: {
  sections: CommandSection[];
  onSelect?: (item: CommandItemType) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Modal
      transparent
      visible={open}
      onRequestClose={() => onOpenChange(false)}
      animationType="fade"
    >
      <Pressable style={styles.dialogOverlay} onPress={() => onOpenChange(false)} />
      <View style={styles.dialogContent}>
        <Command
          sections={sections}
          onSelect={(item) => {
            onSelect?.(item);
            onOpenChange(false);
          }}
        />
      </View>
    </Modal>
  );
};
CommandDialog.displayName = 'CommandDialog';

const CommandInput = React.forwardRef<TextInput, TextInputProps>((props, ref) => {
  const { searchQuery, setSearchQuery } = useCommand();
  return (
    <View style={styles.inputContainer}>
      <Search size={20} color={themeColors.secondaryForeground} />
      <TextInput
        ref={ref}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Digite um comando ou pesquise..."
        placeholderTextColor={themeColors.mutedForeground}
        style={styles.input}
        {...props}
      />
    </View>
  );
});
CommandInput.displayName = 'CommandInput';

type CommandListSection = { title: string; data: CommandItemType[] };

const CommandList = React.forwardRef<
  SectionList<CommandItemType, CommandListSection>,
  Omit<SectionListProps<CommandItemType, CommandListSection>, 'sections'>
>((props, ref) => {
  const { filteredSections, onSelect } = useCommand();

  const sectionsForList = useMemo(
    () => filteredSections.map((s) => ({ title: s.heading, data: s.items })),
    [filteredSections]
  );

  return (
    <SectionList
      ref={ref}
      sections={sectionsForList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CommandItem item={item} onSelect={() => onSelect?.(item)} />
      )}
      renderSectionHeader={({ section: { title } }) => <CommandGroup>{title}</CommandGroup>}
      ListEmptyComponent={<CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>}
      ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
      SectionSeparatorComponent={() => <CommandSeparator />}
      style={styles.list}
      keyboardShouldPersistTaps="handled"
      {...props}
    />
  );
});
CommandList.displayName = 'CommandList';

const CommandEmpty = ({ children, style }: { children: React.ReactNode; style?: ViewProps['style'] }) => (
  <View style={[styles.emptyContainer, style]}>
    <Text style={styles.emptyText}>{children}</Text>
  </View>
);

const CommandGroup = ({ children, style }: { children: React.ReactNode; style?: ViewProps['style'] }) => (
  <View style={[styles.groupContainer, style]}>
    <Text style={styles.groupHeading}>{children}</Text>
  </View>
);

const CommandSeparator = ({ style }: { style?: ViewProps['style'] }) => (
  <View style={[styles.separator, style]} />
);

const CommandItem = ({
  item,
  onSelect,
  style,
}: {
  item: CommandItemType;
  onSelect: () => void;
  style?: PressableProps['style'];
}) => (
  <Pressable
    onPress={onSelect}
    style={(state: PressableStateCallbackType) => [
      styles.item,
      state.pressed && styles.itemPressed,
      typeof style === 'function' ? style(state) : style,
    ]}
  >
    <Text style={styles.itemText}>{item.label}</Text>
  </Pressable>
);
CommandItem.displayName = 'CommandItem';

const CommandShortcut = ({ children, style }: { children: React.ReactNode; style?: TextProps['style'] }) => (
  <Text style={[styles.shortcut, style]}>{children}</Text>
);

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
