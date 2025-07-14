import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Tabs.styles';
import { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './Tabs.types';

const Tabs = ({ defaultValue, onValueChange, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabPress = (value: string) => {
    setActiveTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <View>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === TabsList) {
            return React.cloneElement(child as React.ReactElement<TabsListProps>, { activeTab, onTabPress: handleTabPress });
          }
          if (child.type === TabsContent) {
            return React.cloneElement(child as React.ReactElement<TabsContentProps>, { activeTab });
          }
        }
        return child;
      })}
    </View>
  );
};

const TabsList = ({ style, activeTab, onTabPress, children }: TabsListProps) => {
  return (
    <View style={[styles.list, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          return React.cloneElement(child as React.ReactElement<TabsTriggerProps>, { activeTab, onTabPress });
        }
        return child;
      })}
    </View>
  );
};

const TabsTrigger = ({ value, style, activeTab, onTabPress, children }: TabsTriggerProps) => {
  const isActive = activeTab === value;
  return (
    <TouchableOpacity
      style={[
        styles.trigger,
        isActive && styles.triggerActive,
        style,
      ]}
      onPress={() => onTabPress?.(value)}
    >
      <Text style={[styles.triggerText, isActive && styles.triggerTextActive]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const TabsContent = ({ value, style, activeTab, children }: TabsContentProps) => {
  if (activeTab !== value) {
    return null;
  }
  return <View style={[styles.content, style]}>{children}</View>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
