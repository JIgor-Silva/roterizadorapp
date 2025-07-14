import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Animated, Platform, BackHandler, type ViewProps, type TextProps } from 'react-native';
import { X } from 'lucide-react-native';
import { styles } from './Dialog.styles';
import {
  DialogProps,
  DialogContextValue,
  SimpleComponentProps,
} from './Dialog.types';
import { themeColors } from '../../styles/theme';

const DialogContext = createContext<DialogContextValue | null>(null);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog deve ser usado dentro de um <Dialog>');
  }
  return context;
};

const Dialog = ({ children }: DialogProps) => {
  const [visible, setVisible] = useState(false);
  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  return (
    <DialogContext.Provider value={{ visible, open, close }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children }: { children: React.ReactNode }) => {
  const { open } = useDialog();
  return <Pressable onPress={open}>{children}</Pressable>;
};

const DialogContent = ({ children, style }: { children: React.ReactNode, style?: object }) => {
  const { visible, close } = useDialog();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, animation]);
  
  useEffect(() => {
    if (!visible) return;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return () => backHandler.remove();
  }, [visible, close]);

  const animatedOverlayStyle = { opacity: animation.interpolate({ inputRange: [0, 1], outputRange: [0, 0.8] }) };
  const animatedContentStyle = {
    opacity: animation,
    transform: [
      { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
      { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
    ],
  };

  return (
    <Modal visible={visible} transparent onRequestClose={close} animationType="none">
      <Pressable onPress={close} style={styles.pressableOverlay}>
        <Animated.View style={[styles.overlay, animatedOverlayStyle]} />
      </Pressable>
      <View style={styles.centeredView} pointerEvents="box-none">
        <Animated.View style={[styles.content, animatedContentStyle, style]} onStartShouldSetResponder={() => true}>
          {children}
          <DialogClose />
        </Animated.View>
      </View>
    </Modal>
  );
};

const DialogClose = React.forwardRef<View, ViewProps>(
    (props, ref) => {
        const { close } = useDialog();
        return (
            <Pressable ref={ref as React.Ref<any>} onPress={close} style={styles.closeButton} {...props}>
                <X size={18} color={themeColors.mutedForeground} />
            </Pressable>
        );
    }
);

const DialogHeader = ({ children, style }: { children: React.ReactNode, style?: object }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const DialogFooter = ({ children, style }: { children: React.ReactNode, style?: object }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

const DialogTitle = React.forwardRef<Text, TextProps>(
  ({ children, style, ...props }, ref) => (
    <Text ref={ref} style={[styles.title, style]} {...props}>{children}</Text>
  )
);

const DialogDescription = React.forwardRef<Text, TextProps>(
  ({ children, style, ...props }, ref) => (
    <Text ref={ref} style={[styles.description, style]} {...props}>{children}</Text>
  )
);

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
