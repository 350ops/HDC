import { View, Animated, TouchableOpacity } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import ThemedText from './ThemedText';
import Icon, { IconName } from './Icon';
import { router, usePathname } from 'expo-router';

interface TabDef {
    href: string;
    label: string;
    icon: IconName;
}

const tabs: TabDef[] = [
    { href: '/', label: 'All', icon: 'LayoutGrid' },
    { href: '/experience', label: 'Popular', icon: 'TrendingUp' },
    { href: '/services', label: 'Nearby', icon: 'MapPin' },
];

const HomeTabs = (props: any) => {
    const currentPath = usePathname();

    return (
        <View
            style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } }}
            className="w-full flex-row justify-center bg-light-primary dark:bg-dark-primary border-b border-light-secondary dark:border-dark-secondary"
        >
            {tabs.map((tab) => (
                <TabItem
                    key={tab.href}
                    href={tab.href}
                    active={currentPath === tab.href}
                    label={tab.label}
                    icon={tab.icon}
                    scrollY={props.scrollY}
                />
            ))}
        </View>
    );
};

const TabItem = (props: { href: string; active: boolean; label: string; icon: IconName; scrollY: any }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const animatedSize = useRef(new Animated.Value(28)).current;

    useEffect(() => {
        const listenerId = props.scrollY.addListener(({ value }: { value: number }) => {
            if (value > 20 && isExpanded) {
                setIsExpanded(false);
                Animated.timing(animatedSize, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false
                }).start();
            } else if (value <= 10 && !isExpanded) {
                setIsExpanded(true);
                Animated.timing(animatedSize, {
                    toValue: 28,
                    duration: 200,
                    useNativeDriver: false
                }).start();
            }
        });
        return () => props.scrollY.removeListener(listenerId);
    }, [props.scrollY, animatedSize, isExpanded]);

    return (
        <TouchableOpacity
            onPress={() => router.push(props.href)}
            activeOpacity={0.5}
            className={`items-center pb-2.5 pt-1 mx-6 border-b-2 ${
                props.active ? 'border-highlight' : 'border-transparent'
            }`}
        >
            <Animated.View
                style={{
                    width: animatedSize,
                    height: animatedSize,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Icon
                    name={props.icon}
                    size={22}
                    strokeWidth={props.active ? 2.2 : 1.5}
                />
            </Animated.View>
            <ThemedText
                className={`text-xs mt-1.5 ${
                    props.active
                        ? 'font-bold text-highlight'
                        : 'font-normal text-light-subtext dark:text-dark-subtext'
                }`}
            >
                {props.label}
            </ThemedText>
        </TouchableOpacity>
    );
};

export default HomeTabs;
