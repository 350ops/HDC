import React, { forwardRef } from 'react';
import useThemeColors from '@/app/contexts/ThemeColors';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';

export type ActionSheetRef = BottomSheetRef;

interface ActionSheetThemedProps {
  children: React.ReactNode;
  containerStyle?: Record<string, any>;
}

const ActionSheetThemed = forwardRef<ActionSheetRef, ActionSheetThemedProps>(
  ({ children, containerStyle }, ref) => {
    const colors = useThemeColors();

    return (
      <BottomSheet
        ref={ref}
        containerStyle={{
          backgroundColor: colors.sheet,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          ...(containerStyle ?? {}),
        }}
      >
        {children}
      </BottomSheet>
    );
  }
);

export default ActionSheetThemed;