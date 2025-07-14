import React, { useState, useEffect } from 'react';
import { View, Image, Text, type ImageProps, type ViewProps } from 'react-native';
import { clsx } from 'clsx';
import { AvatarProps } from './Avatar.types';
import styles from './Avatar.styles';


export const Avatar = React.forwardRef<View, AvatarProps>(
  ({ children, className, style, size = 40, ...props }, ref) => {
    const [imageStatus, setImageStatus] = useState<'loading' | 'error' | 'success'>('loading');

    const imageElement = React.Children.toArray(children).find(
      (child): child is React.ReactElement<ImageProps> =>
        React.isValidElement(child) && (child.type as any).displayName === 'AvatarImage'
    );
    
    const fallbackElement = React.Children.toArray(children).find(
      (child): child is React.ReactElement<ViewProps> =>
        React.isValidElement(child) && (child.type as any).displayName === 'AvatarFallback'
    );

    useEffect(() => {
      if (!imageElement) {
        setImageStatus('error');
      } else {
        setImageStatus('loading');
      }
    }, [imageElement]);

    const containerStyle = {
      width: size,
      height: size,
      borderRadius: size,
    };

    return (
      <View
        ref={ref}
        className={clsx("relative shrink-0 overflow-hidden justify-center items-center", className)}
        style={[containerStyle, style]}
        {...props}
      >
        {imageElement && imageStatus !== 'error' &&
          React.cloneElement(imageElement, {
            onLoad: () => setImageStatus('success'),
            onError: () => setImageStatus('error'),
            className: 'w-full h-full',
          })}
        
        {imageStatus === 'error' && fallbackElement}
      </View>
    );
  }
);
Avatar.displayName = 'Avatar';


export const AvatarImage = React.forwardRef<Image, ImageProps>((props, ref) => {
  return <Image ref={ref} {...props} />;
});
AvatarImage.displayName = 'AvatarImage';

export const AvatarFallback = React.forwardRef<View, ViewProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={clsx("w-full h-full flex items-center justify-center bg-zinc-200", className)}
        {...props}
      >
        {typeof children === 'string' 
          ? <Text style={styles.textStyle} className="text-zinc-500 text-sm font-medium">{children}</Text> 
          : children}
      </View>
    );
  }
);
AvatarFallback.displayName = 'AvatarFallback';
