import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, type ViewProps, type TextProps } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, type BottomSheetProps } from '@gorhom/bottom-sheet';
import { type BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { styles } from './Drawer.styles';
import {
  SimpleComponentProps,
  SidebarMenuButtonProps,
  CustomSidebarProps,
  DrawerProps,
  DrawerContextValue,
} from './Drawer.types';

const DrawerContext = createContext<DrawerContextValue | null>(null);

const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer deve ser usado dentro de um <Drawer>');
  }
  return context;
};

const Drawer = ({ children }: { children: React.ReactNode }) => {
  const drawerRef = useRef<BottomSheetMethods>(null);

  const open = useCallback(() => {
    drawerRef.current?.expand();
  }, []);

  const close = useCallback(() => {
    drawerRef.current?.close();
  }, []);

  const contextValue = { drawerRef, open, close };

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
};
Drawer.displayName = "Drawer";

const DrawerTrigger = ({ children }: { children: React.ReactNode }) => {
  const { open } = useDrawer();
  return <Pressable onPress={open}>{children}</Pressable>;
};

const DrawerContent = React.forwardRef<BottomSheet, DrawerProps>(
  ({ children, ...props }, ref) => {
    const { drawerRef } = useDrawer();
    const snapPoints = useMemo(() => props.snapPoints || ['50%', '90%'], [props.snapPoints]);

    return (
      <BottomSheet
        ref={drawerRef}
        index={-1}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
        )}
        {...props}
      >
        <View style={styles.contentContainer}>
            {children}
        </View>
      </BottomSheet>
    );
  }
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ style, ...props }: ViewProps) => (
  <View style={[styles.header, style]} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ style, ...props }: ViewProps) => (
  <View style={[styles.footer, style]} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => (
    <Text ref={ref} style={[styles.title, style]} {...props} />
  )
);
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => (
    <Text ref={ref} style={[styles.description, style]} {...props} />
  )
);
DrawerDescription.displayName = "DrawerDescription";

const DrawerClose = ({ children }: { children: React.ReactNode }) => {
    const { close } = useDrawer();
    return <Pressable onPress={close}>{children}</Pressable>;
};

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
