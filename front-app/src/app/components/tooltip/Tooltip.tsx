import React, { useState, isValidElement } from 'react';
import { View, TouchableOpacity } from 'react-native';
import TooltipView from 'react-native-walkthrough-tooltip';
import { styles } from './Tooltip.styles';
import { TooltipProviderProps, TooltipTriggerProps, TooltipContentProps, TooltipProps } from './Tooltip.types';

export const TooltipProvider = ({ children }: TooltipProviderProps) => <>{children}</>;

export const TooltipTrigger = ({ children }: TooltipTriggerProps) => <>{children}</>;

export const TooltipContent = ({ style, children }: TooltipContentProps) => (
  <View style={[styles.content, style]}>
    {children}
  </View>
);

export const Tooltip = ({ children, placement = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const trigger = React.Children.toArray(children).find(
    (child): child is React.ReactElement => isValidElement(child) && child.type === TooltipTrigger
  );

  const content = React.Children.toArray(children).find(
    (child): child is React.ReactElement => isValidElement(child) && child.type === TooltipContent
  );
  
  if (!trigger || !content) {
    console.error("O componente Tooltip requer um TooltipTrigger e um TooltipContent como filhos.");
    return null;
  }

  return (
    <TooltipView
      isVisible={isVisible}
      content={content as React.ReactElement}
      placement={placement}
      onClose={() => setIsVisible(false)}
      arrowSize={styles.arrow}
      tooltipStyle={styles.tooltipContainer}
    >
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        {trigger}
      </TouchableOpacity>
    </TooltipView>
  );
};
