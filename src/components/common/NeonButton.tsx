import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { theme } from '../../styles/theme';

interface NeonButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'tertiary';
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const NeonButton: React.FC<NeonButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    icon
}) => {
    const glowOpacity = useSharedValue(0.4);
    const color = theme.colors[variant];
    const glowColor = theme.colors.glow[variant === 'primary' ? 'blue' : variant === 'secondary' ? 'pink' : 'green'];

    useEffect(() => {
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(0.8, { duration: 1500 }),
                withTiming(0.4, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            shadowOpacity: glowOpacity.value,
            shadowRadius: interpolate(glowOpacity.value, [0.4, 0.8], [5, 15], Extrapolate.CLAMP),
            borderColor: color,
        };
    });

    return (
        <AnimatedTouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                { borderColor: color, shadowColor: color },
                animatedStyle,
                style
            ]}
            activeOpacity={0.7}
        >
            {icon}
            <Text style={[styles.text, { color: color }, textStyle]}>
                {title.toUpperCase()}
            </Text>
        </AnimatedTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1.5,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginLeft: 8,
    },
});
