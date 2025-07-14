import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { 
  View, 
  FlatList, 
  useWindowDimensions, 
  type ViewProps, 
  type ViewToken,
  type PressableStateCallbackType 
} from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Button, ButtonProps } from 'src/app/components/button/Button';
import { clsx } from 'clsx';
import { CarouselContextProps, CarouselProps, CarouselItemProps, CarouselPreviousProps, CarouselNextProps } from './Carousel.types';
import styles from './Carousel.styles';

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel deve ser usado dentro de um <Carousel />");
  }
  return context;
}

const Carousel = React.forwardRef<View, CarouselProps>(
  ({ orientation = 'horizontal', data, renderItem, children, className, style, ...props }, ref) => {
    const flatListRef = useRef<FlatList<any>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(data.length > 1);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const newIndex = viewableItems[0].index;
        setCurrentIndex(newIndex);
      }
    }, []);

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

    const scrollPrev = useCallback(() => {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }, [currentIndex]);

    const scrollNext = useCallback(() => {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }, [currentIndex]);

    useEffect(() => {
        setCanScrollPrev(currentIndex > 0);
        setCanScrollNext(currentIndex < data.length - 1);
    }, [currentIndex, data.length]);


    return (
      <CarouselContext.Provider
        value={{
          data,
          renderItem,
          flatListRef,
          currentIndex,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          orientation,
          onViewableItemsChanged,
          viewabilityConfig,
        }}
      >
        <View
          ref={ref}
          className={clsx("relative", className)}
          style={style}
          accessibilityLabel="carousel"
          {...props}
        >
          {children}
        </View>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<View, ViewProps>(
  ({ className, style, ...props }, ref) => {
    const { data, renderItem, flatListRef, orientation, onViewableItemsChanged, viewabilityConfig } = useCarousel();
    const { width } = useWindowDimensions();

    return (
      <View ref={ref} className={clsx("overflow-hidden", className)} style={style}> {/* overflow-hidden */}
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={({ item, index }) => (
            <CarouselItem style={{ width: orientation === 'horizontal' ? width : '100%' }}>
              {renderItem({ item, index })}
            </CarouselItem>
          )}
          keyExtractor={(item, index) => `${item?.id || 'key'}-${index}`}
          horizontal={orientation === 'horizontal'}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          {...props}
        />
      </View>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<View, ViewProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={clsx("flex-1 justify-center items-center", className)}
        style={style}
        accessibilityLabel="slide"
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<View, CarouselPreviousProps>(
  ({ className, style, ...props }, ref) => {
    const { scrollPrev, canScrollPrev, orientation } = useCarousel();

    const arrowPositionClasses = orientation === 'horizontal' ? "left-4 top-1/2 -translate-y-1/2" : "top-4 left-1/2 -translate-x-1/2"; // left-4 top-1/2 -translate-y-1/2 ou top-4 left-1/2 -translate-x-1/2

    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={clsx("absolute z-10 rounded-full", arrowPositionClasses, className)} // absolute z-10 rounded-full
        style={style}
        disabled={!canScrollPrev}
        onPress={scrollPrev}
        {...props}
      >
        <ArrowLeft size={18} />
      </Button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<View, CarouselNextProps>(
  ({ className, style, ...props }, ref) => {
    const { scrollNext, canScrollNext, orientation } = useCarousel();

    const arrowPositionClasses = orientation === 'horizontal' ? "right-4 top-1/2 -translate-y-1/2" : "bottom-4 left-1/2 -translate-x-1/2"; // right-4 top-1/2 -translate-y-1/2 ou bottom-4 left-1/2 -translate-x-1/2

    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={clsx("absolute z-10 rounded-full", arrowPositionClasses, className)} // absolute z-10 rounded-full
        style={style}
        disabled={!canScrollNext}
        onPress={scrollNext}
        {...props}
      >
        <ArrowRight size={18} />
      </Button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
