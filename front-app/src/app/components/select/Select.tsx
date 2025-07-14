import React, { createContext, useContext, useMemo } from 'react';
import { View, Text, FlatList, Platform } from 'react-native';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import { Check, ChevronDown } from 'lucide-react-native';
import { SelectContextValue, SelectItemProps, SelectProps, SelectTriggerProps, SelectContentProps, SelectValueProps, SelectLabelProps } from './/Select.types';
import { styles } from './Select.styles';
import { themeColors } from '../../styles/theme';

const SelectContext = createContext<SelectContextValue | null>(null);
const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('useSelect must be used within a <Select>');
  return context;
};

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const options = useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    React.Children.forEach(children, child => {
      if (React.isValidElement(child) && child.type === SelectItem) {
        const typedChild = child as React.ReactElement<SelectItemProps>;
        map.set(typedChild.props.value, typedChild.props.children);
      }
    });
    return map;
  }, [children]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, options }}>
      <Menu>{children}</Menu>
    </SelectContext.Provider>
  );
};
Select.displayName = 'Select';

const SelectTrigger = React.forwardRef<View, SelectTriggerProps>(
  ({ children, style, ...props }, ref) => (
    <MenuTrigger customStyles={{ triggerWrapper: [styles.trigger, style] }} {...props}>
      {children}
      <ChevronDown size={16} color={themeColors.mutedForeground} />
    </MenuTrigger>
  )
);
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const { value, options } = useSelect();
  const label = value ? options.get(value) : null;
  const hasValue = label !== null && label !== undefined;

  return (
    <Text style={[styles.valueText, !hasValue && styles.placeholderText]}>
      {hasValue ? label : placeholder}
    </Text>
  );
};
SelectValue.displayName = 'SelectValue';

const SelectContent = ({ children, style }: SelectContentProps) => (
  <MenuOptions customStyles={{ optionsContainer: [styles.contentContainer, style] }}>
    <FlatList
      data={React.Children.toArray(children).filter((child): child is React.ReactElement<SelectItemProps> => React.isValidElement(child) && child.type === SelectItem)}
      renderItem={({ item }) => <>{item}</>}
      keyExtractor={(item, index) => item.props.value || index.toString()}
    />
  </MenuOptions>
);
SelectContent.displayName = 'SelectContent';

const SelectItem = ({ children, value, disabled }: SelectItemProps) => {
  const { value: selectedValue, onValueChange } = useSelect();
  const isSelected = value === selectedValue;

  return (
    <MenuOption onSelect={() => onValueChange(value)} disabled={disabled}>
      <View style={styles.item}>
        <View style={styles.itemIndicator}> 
          {isSelected && <Check size={16} color={themeColors.foreground} />}
        </View>
        <Text style={styles.itemText}>{children}</Text>
      </View>
    </MenuOption>
  );
};
SelectItem.displayName = 'SelectItem';

const SelectLabel = ({ children }: SelectLabelProps) => (
  <Text style={styles.label}>{children}</Text>
);
SelectLabel.displayName = 'SelectLabel';

const SelectSeparator = () => <View style={styles.separator} />;
SelectSeparator.displayName = 'SelectSeparator';

export {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
