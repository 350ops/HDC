import { Modal, Pressable, View, Platform } from "react-native";
import Animated from 'react-native-reanimated';
import Icon from "./Icon";
import ThemedText from "./ThemedText";
import ThemeToggle from "./ThemeToggleOld";
import { Link } from "expo-router";
import React, { useState, useEffect } from "react";

import useThemeColors from "@/app/contexts/ThemeColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TextInput } from "react-native-gesture-handler";

import AnimatedView from "./AnimatedView";
import ThemedScroller from "./ThemeScroller";
import { shadowPresets } from '@/utils/useShadow';
import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import DateRangeCalendar from "./DateRangeCalendar";
import { Button } from "./Button";

const SearchBar = (props: any) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <View className='px-global  bg-light-primary dark:bg-dark-primary w-full relative z-50'>

                <Pressable className="" onPress={() => setShowModal(true)}>
                    <Animated.View
                        sharedTransitionTag="searchBar"
                        style={{ elevation: 10, height: 50, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8.84, shadowOffset: { width: 0, height: 0 } }}
                        className='bg-light-primary flex-row justify-center relative z-50 py-4 px-10 mt-3 mb-4  dark:bg-white/20 rounded-full'>
                        <Icon name="Search" size={16} strokeWidth={3} />
                        <ThemedText className='text-black dark:text-white font-medium ml-2 mr-4'>Find a facility</ThemedText>
                        
                    </Animated.View>
                </Pressable>
            </View>

            <SearchModal showModal={showModal} setShowModal={setShowModal} />
        </>
    )
}

const SearchModal = ({ showModal, setShowModal }: { showModal: boolean, setShowModal: (show: boolean) => void }) => {

    const insets = useSafeAreaInsets();
    const [openAccordion, setOpenAccordion] = useState<string | null>('sport');


    return (
        <Modal statusBarTranslucent={true} className='flex-1' visible={showModal} transparent={true} animationType="fade">

            <BlurView experimentalBlurMethod="none" intensity={20} tint="systemUltraThinMaterialLight" className='flex-1 '>
                <AnimatedView className="flex-1" animation='slideInTop' duration={Platform.OS === 'ios' ? 500 : 0} delay={0} >
                    <View className="flex-1 bg-neutral-200/70 dark:bg-black/90 ">
                        <ThemedScroller style={{ paddingTop: insets.top + 10 }} className="bg-transparent">
                            <Pressable
                                onPress={() => setShowModal(false)}
                                style={{ ...shadowPresets.card, elevation: 10, height: 50, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8.84, shadowOffset: { width: 0, height: 0 } }}
                                className="items-center justify-center w-12 my-3 h-12 rounded-full ml-auto bg-light-primary dark:bg-dark-secondary">
                                <Icon name="X" size={24} strokeWidth={2} />
                            </Pressable>
                            <AccordionItem
                                title="Which sport?"
                                label="Any sport"
                                isOpen={openAccordion === 'sport'}
                                onPress={() => setOpenAccordion(openAccordion === 'sport' ? null : 'sport')}>
                                <SportPicker />
                            </AccordionItem>

                            <AccordionItem
                                title="When?"
                                label="Any date"
                                isOpen={openAccordion === 'when'}
                                onPress={() => setOpenAccordion(openAccordion === 'when' ? null : 'when')}>
                                <DateRangeCalendar
                                    onDateRangeChange={(range) => {
                                        console.log('Date range selected:', range);
                                    }}
                                    minDate={new Date().toISOString().split('T')[0]}
                                    className="mt-4"
                                />
                            </AccordionItem>
                        </ThemedScroller>
                        <View style={{ paddingBottom: insets.bottom + 10 }} className="flex-row w-full px-6 justify-between">
                            <Button title="Clear " onPress={() => setShowModal(false)} variant="ghost" className="" />
                            <Button iconStart="Search" title="Search" iconColor="white" textClassName="text-white" onPress={() => {setShowModal(false); router.push('/')}} variant="primary" className="" />
                        </View>
                    </View>
                </AnimatedView>
            </BlurView>
        </Modal>
    );
};

const AccordionItem = ({
    title,
    children,
    isOpen,
    label,
    onPress
}: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    label?: string;
    onPress: () => void;
}) => {
    const [contentHeight, setContentHeight] = useState(0);
    const animatedHeight = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        height: withTiming(animatedHeight.value, { duration: 200 }),
        overflow: 'hidden',
    }));

    useEffect(() => {
        animatedHeight.value = isOpen ? contentHeight : 0;
    }, [isOpen, contentHeight]);

    return (
        <View
            style={{ ...shadowPresets.large }}
            className='bg-light-primary relative dark:bg-dark-secondary rounded-2xl mb-global'>
            <Pressable onPress={onPress} className='w-full p-global'>

                <View className='flex-row w-full justify-between items-center'>
                    <ThemedText className={` ${isOpen ? 'text-lg' : 'text-lg'} font-semibold`}>{title}</ThemedText>
                    {isOpen ? <></> : <ThemedText className='text-sm font-semibold'>{label}</ThemedText>}
                </View>
            </Pressable>


            <Animated.View style={animatedStyle}>
                <View
                    onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
                    className="absolute w-full px-global pb-2 pt-0 -mt-4">
                    {children}
                </View>
            </Animated.View>
        </View>
    );
};

const SportPicker = () => {
    const colors = useThemeColors();
    const [selectedSport, setSelectedSport] = useState<string | null>(null);

    const sports = [
        { name: 'Football', icon: 'CircleDot', description: 'Fields & pitches', iconbg: 'bg-green-100 dark:bg-green-900' },
        { name: 'Cricket', icon: 'Target', description: 'Grounds & nets', iconbg: 'bg-amber-100 dark:bg-amber-900' },
        { name: 'Basketball', icon: 'Circle', description: 'Courts & hoops', iconbg: 'bg-orange-100 dark:bg-orange-900' },
        { name: 'Badminton', icon: 'Wind', description: 'Indoor courts', iconbg: 'bg-sky-100 dark:bg-sky-900' },
        { name: 'Volleyball', icon: 'Waves', description: 'Courts & beaches', iconbg: 'bg-yellow-100 dark:bg-yellow-900' },
        { name: 'Tennis', icon: 'Dumbbell', description: 'Hard & clay courts', iconbg: 'bg-lime-100 dark:bg-lime-900' },
        { name: 'Swimming', icon: 'Droplets', description: 'Pools & lanes', iconbg: 'bg-blue-100 dark:bg-blue-900' },
    ];

    return (
        <>
            <View className='relative'>
                <Icon name="Search" className='absolute left-4 top-1/2 -translate-y-1/2' size={16} strokeWidth={3} />
                <TextInput
                    className='p-4 pl-10 mt-4 border border-neutral-500 dark:border-neutral-300 rounded-xl'
                    placeholder='Search sports'
                    placeholderTextColor={colors.text}
                />
            </View>
            <ThemedText className='text-xs mt-4'>Popular sports</ThemedText>
            {sports.map((sport) => (
                <SportRow
                    key={sport.name}
                    icon={sport.icon}
                    title={sport.name}
                    description={sport.description}
                    iconbg={sport.iconbg}
                    selected={selectedSport === sport.name}
                    onPress={() => setSelectedSport(selectedSport === sport.name ? null : sport.name)}
                />
            ))}
        </>
    )
}

const SportRow = (props: any) => {
    return (
        <Pressable onPress={props.onPress} className="flex-row items-center justify-start my-2">
            <Icon name={props.icon} size={25} strokeWidth={1.2} className={`w-12 h-12 rounded-xl bg-light-secondary dark:bg-dark-primary ${props.iconbg}`} />
            <View className="ml-4 flex-1">
                <ThemedText className="text-sm font-semibold">{props.title}</ThemedText>
                <ThemedText className="text-xs text-neutral-500">{props.description}</ThemedText>
            </View>
            {props.selected && <Icon name="Check" size={18} strokeWidth={2} />}
        </Pressable>
    )
}

export default SearchBar;