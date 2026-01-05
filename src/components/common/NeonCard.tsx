import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../styles/theme';

interface NeonCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'blue' | 'pink' | 'green';
}

export const NeonCard: React.FC<NeonCardProps> = ({ children, style, variant = 'blue' }) => {
    const color = variant === 'blue' ? theme.colors.primary : variant === 'pink' ? theme.colors.secondary : theme.colors.tertiary;

    return (
        <View style={[styles.card, { borderColor: color, shadowColor: color }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        padding: theme.spacing.md,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
});
