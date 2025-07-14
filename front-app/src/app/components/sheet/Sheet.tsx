import React, { createContext, useCallback, useContext, useState, useRef, useMemo, useEffect } from 'react';
import { View, Pressable, Modal, Animated, Platform, BackHandler, useWindowDimensions, StyleSheet, Text } from 'react-native';
import { X } from 'lucide-react-native';
import { SheetContextValue, SheetProps, SheetTriggerProps, SheetCloseProps, SheetContentProps, SheetOverlayProps, SheetHeaderProps, SheetFooterProps, SheetTitleProps, SheetDescriptionProps, Side } from './Sheet.types';
import { styles } from './Sheet.styles';
import { themeColors } from '../../styles/theme';

const SheetContext = createContext<SheetContextValue | null>(null);
const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) throw new Error('useSheet must be used within a <Sheet>');
  return context;
};


const Sheet = ({ children }: SheetProps) => {
  const [visible, setVisible] = useState(false);
  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  return (
    <SheetContext.Provider value={{ visible, open, close }}>
      {children}
    </SheetContext.Provider>
  );
};
Sheet.displayName = 'Sheet';

const SheetTrigger = ({ children }: SheetTriggerProps) => {
  const { open } = useSheet();
  return <Pressable onPress={open}>{children}</Pressable>;
};
SheetTrigger.displayName = "SheetTrigger";

const SheetClose = React.forwardRef<View, SheetCloseProps>(
    (props, ref) => {
        const { close } = useSheet();
        return (
            <Pressable ref={ref} onPress={close} {...props} />
        );
    }
);
SheetClose.displayName = "SheetClose";

const SheetContent = React.forwardRef<View, SheetContentProps>(
  ({ side = 'right', style, children, ...props }, ref) => {
    const { visible, close } = useSheet();
    const { height: screenHeight, width: screenWidth } = useWindowDimensions();
    const animation = useRef(new Animated.Value(0)).current;

    const animatedStyle = useMemo(() => {
        const initialPosition: Record<Side, number> = {
            top: -screenHeight, bottom: screenHeight, left: -screenWidth, right: screenWidth
        };

        const interpolation = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [initialPosition[side], 0],
        });

        if (side === 'top' || side === 'bottom') {
            return { transform: [{ translateY: interpolation }] };
        } else {
            return { transform: [{ translateX: interpolation }] };
        }
    }, [side, screenHeight, screenWidth, animation]);

    useEffect(() => {
      Animated.timing(animation, { toValue: visible ? 1 : 0, duration: 400, useNativeDriver: true }).start();
    }, [visible, animation]);

    useEffect(() => {
      if (!visible) return;
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => { close(); return true; });
      return () => backHandler.remove();
    }, [visible, close]);

    const sideStyle = styles[side as Side];

    return (
      <Modal visible={visible} transparent onRequestClose={close} animationType="none">
        <SheetOverlay onPress={close} animationValue={animation} />
        <Animated.View ref={ref} style={[styles.contentBase, sideStyle, animatedStyle, style]} {...props}>
          {children}
          <SheetClose style={styles.closeButton}>
            <X size={18} color={themeColors.mutedForeground} />
          </SheetClose>
        </Animated.View>
      </Modal>
    );
  }
);
SheetContent.displayName = "SheetContent";


const SheetOverlay = ({ onPress, animationValue }: SheetOverlayProps) => {
    return (
        <Pressable style={StyleSheet.absoluteFill} onPress={onPress}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: animationValue }]} />
        </Pressable>
    );
};
SheetOverlay.displayName = "SheetOverlay";

const SheetHeader = ({ style, ...props }: SheetHeaderProps) => <View style={[styles.header, style]} {...props} />;
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ style, ...props }: SheetFooterProps) => <View style={[styles.footer, style]} {...props} />;
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<Text, SheetTitleProps>((props, ref) => <Text ref={ref} style={styles.title} {...props} />);
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<Text, SheetDescriptionProps>((props, ref) => <Text ref={ref} style={styles.description} {...props} />);
SheetDescription.displayName = "SheetDescription";

export {
  Sheet, SheetClose,
  SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetTitle, SheetTrigger
};
