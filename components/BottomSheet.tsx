import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import useThemeColors from '@/app/contexts/ThemeColors';

export interface BottomSheetRef {
  show: () => void;
  hide: () => void;
}

interface BottomSheetProps {
  children: React.ReactNode;
  containerClassName?: string;
  containerStyle?: Record<string, any>;
  onClose?: () => void;
}

export default forwardRef<BottomSheetRef, BottomSheetProps>(function BottomSheet(
  { children, containerClassName = '', containerStyle: containerStyleProp, onClose },
  ref
) {
  const colors = useThemeColors();
  const [visible, setVisible] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      show: () => setVisible(true),
      hide: () => {
        setVisible(false);
        onClose?.();
      },
    }),
    [onClose]
  );

  const containerStyle = useMemo(
    () => ({
      backgroundColor: colors.sheet,
      ...(containerStyleProp ?? {}),
    }),
    [colors.sheet, containerStyleProp]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <Pressable className="flex-1 bg-black/40" onPress={() => setVisible(false)} />
      <View
        style={containerStyle}
        className={`rounded-t-3xl px-4 pb-6 pt-3 ${containerClassName}`}
      >
        <View className="items-center pb-3">
          <View className="h-1 w-10 rounded-full bg-light-subtext/30 dark:bg-dark-subtext/30" />
        </View>
        {children}
      </View>
    </Modal>
  );
});

