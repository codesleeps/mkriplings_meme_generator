import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, Sparkles, Save, Share2 } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { NeonButton } from '../components/common/NeonButton';
import { NeonCard } from '../components/common/NeonCard';
import { GradientBackground } from '../components/common/GradientBackground';
import { aiService } from '../services/ai';
import { dbService } from '../services/database';
import * as Sharing from 'expo-sharing';

export const GenerationScreen = () => {
    const [image, setImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setResultImage(null);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setResultImage(null);
        }
    };

    const generateMeme = async () => {
        if (!prompt && !image) {
            Alert.alert('Incomplete', 'Please provide an image or a prompt.');
            return;
        }

        setIsGenerating(true);
        const response = await aiService.generateMeme({
            imageUri: image || undefined,
            prompt: prompt,
        });

        if (response.success && response.uri) {
            setResultImage(response.uri);
        } else {
            const errorMsg = response.error || 'Failed to generate meme. Please check your API key in Settings.';
            Alert.alert('Generation Failed', errorMsg);
        }
        setIsGenerating(false);
    };

    const saveMeme = async () => {
        if (!resultImage) return;

        try {
            const localUri = await aiService.saveToDevice(resultImage);
            await dbService.saveMeme(localUri, prompt);
            Alert.alert('Success', 'Meme saved to gallery!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save meme.');
        }
    };

    const shareMeme = async () => {
        if (!resultImage) return;
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
            await Sharing.shareAsync(resultImage);
        } else {
            Alert.alert('Error', 'Sharing is not available on this device.');
        }
    };

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <NeonCard style={styles.previewCard}>
                        {resultImage || image ? (
                            <Image
                                source={{ uri: resultImage || image! }}
                                style={styles.previewImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Sparkles size={48} color={theme.colors.text.muted} />
                                <TextInput
                                    placeholder="NO IMAGE SELECTED"
                                    placeholderTextColor={theme.colors.text.muted}
                                    style={styles.placeholderText}
                                    editable={false}
                                />
                            </View>
                        )}

                        {isGenerating && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                                <TextInput
                                    value="AI IS PROCESSING..."
                                    editable={false}
                                    style={[styles.placeholderText, { color: theme.colors.primary, marginTop: 10 }]}
                                />
                            </View>
                        )}
                    </NeonCard>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter instructions (e.g., 'Make it look 80s', 'Add caption: U WOT M8')"
                            placeholderTextColor={theme.colors.text.muted}
                            value={prompt}
                            onChangeText={setPrompt}
                            multiline
                        />
                    </View>

                    <View style={styles.buttonGrid}>
                        <NeonButton
                            title="Upload"
                            icon={<ImageIcon size={20} color={theme.colors.primary} />}
                            onPress={pickImage}
                            style={styles.gridButton}
                        />
                        <NeonButton
                            title="Camera"
                            icon={<Camera size={20} color={theme.colors.primary} />}
                            onPress={takePhoto}
                            style={styles.gridButton}
                        />
                    </View>

                    <NeonButton
                        title={isGenerating ? "Processing..." : "Generate Meme"}
                        variant="tertiary"
                        onPress={generateMeme}
                        style={styles.generateButton}
                    />

                    {resultImage && (
                        <View style={styles.actionRow}>
                            <NeonButton
                                title="Save"
                                variant="secondary"
                                icon={<Save size={20} color={theme.colors.secondary} />}
                                onPress={saveMeme}
                                style={styles.actionButton}
                            />
                            <NeonButton
                                title="Share"
                                variant="primary"
                                icon={<Share2 size={20} color={theme.colors.primary} />}
                                onPress={shareMeme}
                                style={styles.actionButton}
                            />
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        padding: theme.spacing.lg,
        paddingTop: 60,
    },
    previewCard: {
        aspectRatio: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        overflow: 'hidden',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    placeholderText: {
        color: theme.colors.text.muted,
        marginTop: theme.spacing.md,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: theme.spacing.lg,
    },
    textInput: {
        backgroundColor: theme.colors.surface,
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        color: theme.colors.text.primary,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    buttonGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
    },
    gridButton: {
        flex: 0.48,
    },
    generateButton: {
        width: '100%',
        marginBottom: theme.spacing.lg,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 0.48,
    },
});
