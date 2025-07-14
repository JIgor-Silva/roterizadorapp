import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Modal, Animated, BackHandler } from 'react-native';
import { clsx } from 'clsx';
import { AlertDialogContextValue, AlertDialogContentProps, ButtonProps } from './AlertDialog.types';
import styles from './AlertDialog.styles';

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('useAlertDialog deve ser usado dentro de um <AlertDialog>');
  }
  return context;
};

export const AlertDialog = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  return (
    <AlertDialogContext.Provider value={{ visible, open, close }}>
      {children}
    </AlertDialogContext.Provider>
  );
};
AlertDialog.displayName = "AlertDialog";

export const AlertDialogTrigger = ({ children }: { children: React.ReactNode }) => {
  const { open } = useAlertDialog();
  return <Pressable onPress={open}>{children}</Pressable>;
};
AlertDialogTrigger.displayName = "AlertDialogTrigger";

export const AlertDialogContent = ({ children, className }: AlertDialogContentProps) => {
  const { visible, close } = useAlertDialog();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, animation]);
  
  useEffect(() => {
    if (!visible) return;
    const backAction = () => {
      close();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [visible, close]);

  const animatedOverlayStyle = { opacity: animation.interpolate({ inputRange: [0, 1], outputRange: [0, 0.8] }) };
  const animatedContentStyle = { opacity: animation, transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] };

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={true} transparent onRequestClose={close}>
      <Pressable onPress={close} className="absolute inset-0">
        <Animated.View className="absolute inset-0 bg-black" style={animatedOverlayStyle} />
      </Pressable>
      <View className="flex-1 justify-center items-center" pointerEvents="box-none">
        <Animated.View 
            className={clsx("w-[90%] max-w-lg bg-white rounded-xl p-6 shadow-lg gap-2", className)} 
            style={animatedContentStyle} 
            onStartShouldSetResponder={() => true}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};
AlertDialogContent.displayName = "AlertDialogContent";

export const AlertDialogHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <View className={clsx("gap-1", className)}>{children}</View>
);
AlertDialogHeader.displayName = "AlertDialogHeader";

export const AlertDialogFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <View className={clsx("flex-row justify-end gap-2 mt-4", className)}>{children}</View>
);
AlertDialogFooter.displayName = "AlertDialogFooter";

export const AlertDialogTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <Text style={styles.textStyle} className={clsx("text-lg font-semibold text-zinc-900", className)}>{children}</Text>
);
AlertDialogTitle.displayName = "AlertDialogTitle";

export const AlertDialogDescription = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <Text style={styles.textStyle} className={clsx("text-sm text-zinc-500 leading-normal", className)}>{children}</Text>
);
AlertDialogDescription.displayName = "AlertDialogDescription";

export const AlertDialogAction = React.forwardRef<View, ButtonProps>(
  ({ children, className, onPress, ...props }, ref) => {
    const { close } = useAlertDialog();
    return (
      <Pressable
        ref={ref}
        className={clsx("rounded-lg py-2.5 px-4 bg-zinc-900 active:opacity-80", className)}
        onPress={(e) => {
          onPress?.(e);
          close();
        }}
        {...props}
      >
        <Text style={styles.textStyle} className="text-white text-sm font-medium">{children}</Text>
      </Pressable>
    );
  }
);

export const AlertDialogCancel = React.forwardRef<View, ButtonProps>(
  ({ children, className, onPress, ...props }, ref) => {
    const { close } = useAlertDialog();
    return (
      <Pressable
        ref={ref}
        className={clsx("rounded-lg py-2.5 px-4 bg-transparent border border-zinc-200 active:opacity-80", className)}
        onPress={(e) => {
          onPress?.(e);
          close();
        }}
        {...props}
      >
        <Text style={styles.textStyle} className="text-zinc-900 text-sm font-medium">{children}</Text>
      </Pressable>
    );
  }
);
