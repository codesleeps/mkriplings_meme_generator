import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { User, Shield, Info, LogOut, ChevronRight } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { GradientBackground } from '../components/common/GradientBackground';
import { NeonCard } from '../components/common/NeonCard';

export const SettingsScreen = () => {
    const [notifications, setNotifications] = useState(true);
    const [biometrics, setBiometrics] = useState(false);

    return (
        <GradientBackground>
            <View style={styles.container}>
                <Text style={styles.title}>SYSTEM CONFIG</Text>

                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <User size={40} color={theme.colors.primary} />
                    </View>
                    <View>
                        <Text style={styles.userName}>CYBER_USER_01</Text>
                        <Text style={styles.userEmail}>user@neural.net</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SECURITY</Text>
                    <NeonCard style={styles.settingRow}>
                        <View style={styles.rowLead}>
                            <Shield size={20} color={theme.colors.secondary} />
                            <Text style={styles.settingText}>NEURAL LINK (BIOMETRICS)</Text>
                        </View>
                        <Switch
                            value={biometrics}
                            onValueChange={setBiometrics}
                            trackColor={{ false: '#333', true: theme.colors.tertiary }}
                            thumbColor={biometrics ? '#fff' : '#666'}
                        />
                    </NeonCard>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SYSTEM</Text>
                    <TouchableOpacity style={styles.navRow}>
                        <View style={styles.rowLead}>
                            <Info size={20} color={theme.colors.primary} />
                            <Text style={styles.settingText}>VERSION 2.5.0-FLASH</Text>
                        </View>
                        <ChevronRight size={20} color={theme.colors.muted} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <LogOut size={20} color={theme.colors.secondary} />
                    <Text style={styles.logoutText}>TERMINATE SESSION</Text>
                </TouchableOpacity>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.lg,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        letterSpacing: 4,
        marginBottom: theme.spacing.xl,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(0, 242, 255, 0.1)',
        borderWidth: 2,
        borderColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.lg,
    },
    userName: {
        color: theme.colors.text.primary,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    userEmail: {
        color: theme.colors.muted,
        fontSize: 12,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        color: theme.colors.muted,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: theme.spacing.md,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    rowLead: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.md,
        fontSize: 14,
        letterSpacing: 1,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: theme.spacing.xl,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.secondary,
        borderRadius: theme.borderRadius.md,
    },
    logoutText: {
        color: theme.colors.secondary,
        fontWeight: 'bold',
        marginLeft: theme.spacing.sm,
        letterSpacing: 2,
    },
});
