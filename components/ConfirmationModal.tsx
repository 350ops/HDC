import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import useThemeColors from '@/app/contexts/ThemeColors';
import ThemedText from '@/components/ThemedText';
import * as NavigationBar from 'expo-navigation-bar';
import { useTheme } from '@/app/contexts/ThemeContext';
import BottomSheet, { BottomSheetRef } from '@/components/BottomSheet';

interface ConfirmationModalProps {
    isVisible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    actionSheetRef: React.RefObject<BottomSheetRef>;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    actionSheetRef
}) => {
    const { isDark } = useTheme();
    const colors = useThemeColors();

    React.useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync(colors.bg);
            NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');

            return () => {
                // Reset to default theme color when modal closes
                NavigationBar.setBackgroundColorAsync(colors.bg);
                NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
            };
        }
    }, [isDark, colors.bg]);

    const handleConfirm = () => {
        actionSheetRef.current?.hide();
        onConfirm();
    };

    const handleCancel = () => {
        actionSheetRef.current?.hide();
        onCancel();
    };

    return (
        <BottomSheet
            ref={actionSheetRef}
            containerStyle={{
                backgroundColor: colors.bg,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24
            }}
        >
            <View className="p-8 pb-14">
                <ThemedText className="text-xl font-bold mb-2">{title}</ThemedText>
                <ThemedText className="text-light-subtext dark:text-dark-subtext mb-6">{message}</ThemedText>
                
                <View className="flex-row justify-between space-x-3">
                    <Pressable
                        onPress={handleCancel}
                        className="px-4 py-3 flex-1 rounded-lg items-center bg-light-secondary dark:bg-dark-secondary"
                    >
                        <ThemedText>{cancelText}</ThemedText>
                    </Pressable>
                    <Pressable
                        onPress={handleConfirm}
                        className="px-4 py-3 flex-1 items-center rounded-lg bg-red-500"
                    >
                        <Text className="text-white">{confirmText}</Text>
                    </Pressable>
                </View>
            </View>
        </BottomSheet>
    );
};

export default ConfirmationModal;