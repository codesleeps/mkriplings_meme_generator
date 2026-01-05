import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Text,
    Alert
} from 'react-native';
import { Trash2, Share2, ZoomIn } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { GradientBackground } from '../components/common/GradientBackground';
import { NeonCard } from '../components/common/NeonCard';
import { dbService, MemeRow } from '../services/database';
import * as Sharing from 'expo-sharing';

export const GalleryScreen = () => {
    const [memes, setMemes] = useState<MemeRow[]>([]);

    const loadMemes = async () => {
        const data = await dbService.getMemes();
        setMemes(data);
    };

    useEffect(() => {
        loadMemes();
    }, []);

    const deleteMeme = (id: number) => {
        Alert.alert(
            'Delete Meme',
            'Are you sure you want to delete this masterpiece?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await dbService.deleteMeme(id);
                        loadMemes();
                    }
                },
            ]
        );
    };

    const shareMeme = async (uri: string) => {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
            await Sharing.shareAsync(uri);
        }
    };

    const renderItem = ({ item }: { item: MemeRow }) => (
        <NeonCard style={styles.memeCard}>
            <Image source={{ uri: item.uri }} style={styles.memeImage} resizeMode="cover" />
            <View style={styles.cardInfo}>
                <Text style={styles.promptText} numberOfLines={1}>
                    {item.prompt || 'No caption'}
                </Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => shareMeme(item.uri)}>
                        <Share2 size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteMeme(item.id)}>
                        <Trash2 size={20} color={theme.colors.secondary} />
                    </TouchableOpacity>
                </View>
            </View>
        </NeonCard>
    );

    return (
        <GradientBackground>
            <View style={styles.container}>
                <Text style={styles.title}>NEURAL GALLERY</Text>
                <FlatList
                    data={memes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>GENERATE YOUR FIRST MEME TO START YOUR COLLECTION</Text>
                        </View>
                    }
                    onRefresh={loadMemes}
                    refreshing={false}
                />
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        letterSpacing: 4,
        marginBottom: theme.spacing.lg,
    },
    listContent: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    memeCard: {
        width: '48%',
        marginBottom: theme.spacing.md,
        padding: 0,
        overflow: 'hidden',
    },
    memeImage: {
        width: '100%',
        aspectRatio: 1,
    },
    cardInfo: {
        padding: theme.spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    promptText: {
        color: theme.colors.text.primary,
        fontSize: 12,
        marginBottom: theme.spacing.xs,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 4,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyText: {
        color: theme.colors.muted,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 2,
    },
});
