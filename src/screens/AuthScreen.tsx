import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { LogIn, UserPlus, Fingerprint } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { GradientBackground } from '../components/common/GradientBackground';
import { NeonButton } from '../components/common/NeonButton';

interface AuthScreenProps {
    onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Fingerprint size={64} color={theme.colors.primary} />
                    <Text style={styles.title}>BANANA OS</Text>
                    <Text style={styles.subtitle}>SECURE ACCESS GRANTED</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>IDENTIFIER</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="user@neural.net"
                            placeholderTextColor={theme.colors.muted}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSCODE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={theme.colors.muted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <NeonButton
                        title={isLogin ? 'Initialize' : 'Register'}
                        onPress={onLogin}
                        style={styles.submitButton}
                        variant={isLogin ? 'primary' : 'secondary'}
                    />

                    <TouchableOpacity
                        onPress={() => setIsLogin(!isLogin)}
                        style={styles.switchContainer}
                    >
                        <Text style={styles.switchText}>
                            {isLogin ? "NEW SUBJECT? REGISTER" : "EXISTING ENTITY? LOGIN"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: theme.colors.primary,
        letterSpacing: 8,
        marginTop: theme.spacing.md,
    },
    subtitle: {
        fontSize: 12,
        color: theme.colors.secondary,
        letterSpacing: 4,
        fontWeight: 'bold',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        color: theme.colors.tertiary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 4,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.md,
        color: theme.colors.text.primary,
        fontSize: 16,
    },
    submitButton: {
        marginTop: theme.spacing.lg,
    },
    switchContainer: {
        marginTop: theme.spacing.xl,
        alignItems: 'center',
    },
    switchText: {
        color: theme.colors.muted,
        fontSize: 12,
        letterSpacing: 1,
    },
});
