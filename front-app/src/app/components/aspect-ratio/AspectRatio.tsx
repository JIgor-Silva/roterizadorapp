// src/app/components/aspect-ratio/AspectRatio.tsx
import React from 'react';
import { View, type ViewProps } from 'react-native';
import { clsx } from 'clsx';
import { AspectRatioProps } from './AspectRatio.types';
import { styles } from './AspectRatio.styles';

/**
 * Um componente View que mantém uma proporção dimensional constante.
 * Pode ser controlado pela prop `ratio` (largura / altura) ou por classes do NativeWind.
 */
export const AspectRatio = React.forwardRef<View, AspectRatioProps>(
  ({ ratio, children, style, className, ...props }, ref) => {
    
    // Cria um objeto de estilo para a proporção apenas se a prop `ratio` for fornecida.
    const ratioStyle = ratio ? { aspectRatio: ratio } : {};

    return (
      <View
        ref={ref}
        // O estilo combina o ratio dinâmico com qualquer `style` customizado.
        style={[ratioStyle, style]}
        // O `className` é passado diretamente para permitir o uso de classes do NativeWind.
        className={clsx(className)}
        {...props}
      >
        {children}
      </View>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';
