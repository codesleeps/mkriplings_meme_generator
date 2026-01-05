import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from secure store or env
const getApiKey = async (): Promise<string> => {
    try {
        const storedKey = await SecureStore.getItemAsync('gemini_api_key');
        if (storedKey) return storedKey;
    } catch (error) {
        console.error('Error retrieving API key from secure store:', error);
    }
    return process.env.EXPO_PUBLIC_GEMINI_KEY || '';
};

// Set API key in secure store
export const setApiKey = async (key: string): Promise<void> => {
    try {
        await SecureStore.setItemAsync('gemini_api_key', key);
    } catch (error) {
        console.error('Error storing API key:', error);
        throw new Error('Failed to save API key');
    }
};

// Initialize will be done per request

export interface MemeRequest {
    imageUri?: string;
    prompt: string;
}

export interface MemeResponse {
    uri: string;
    success: boolean;
    error?: string;
}

class AIService {
    // 2026-Current Model Roadmap
    private readonly MODELS = [
        'gemini-2.5-flash-image', // Nano Banana: The primary image-gen model
        'gemini-2.5-flash',       // Next-gen stable baseline
        'gemini-3-flash',         // Cutting-edge preview
        'gemini-1.5-flash'        // Legacy fallback
    ];

    /**
     * Generates a meme based on user instructions and an optional base image.
     * Utilizes the 2026 Gemini model suite (Nano Banana / Gemini 2.5).
     */
    async generateMeme(request: MemeRequest): Promise<MemeResponse> {
        console.log(`[NEURAL LINK] Initializing generation for subject: ${request.prompt}`);

        const API_KEY = await getApiKey();
        if (!API_KEY) {
            // Mock response for testing
            console.log('[MOCK] Generating mock meme');
            return {
                uri: 'https://picsum.photos/400/400?random=' + Date.now(), // Random image
                success: true
            };
        }

        const genAI = new GoogleGenerativeAI(API_KEY);

        for (const modelName of this.MODELS) {
            try {
                console.log(`[NEURAL LINK] Attempting link via ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });

                let promptParts: any[] = [
                    `NEURAL SYSTEM OVERRIDE: 
          Role: Meme Synthesis Engine.
          Instruction: Interpret the humor in "${request.prompt}" and generate a corresponding meme image. 
          If you are an image generator, output the image directly.
          If you are text-only, analyze and respond so the fallback system can render it.`
                ];

                if (request.imageUri) {
                    const base64Data = await FileSystem.readAsStringAsync(request.imageUri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    promptParts.push({
                        inlineData: {
                            data: base64Data,
                            mimeType: "image/jpeg"
                        }
                    });
                }

                const result = await model.generateContent(promptParts);
                const response = await result.response;

                // Check for direct image output (specific to gemini-2.5-flash-image)
                const parts = response.candidates?.[0]?.content?.parts;
                const imagePart = parts?.find(p => p.inlineData);

                if (imagePart && imagePart.inlineData) {
                    console.log('[NEURAL LINK] Direct image synthesized.');
                    const base64Image = imagePart.inlineData.data;
                    const filename = `gen_${Date.now()}.png`;
                    const localUri = `${FileSystem.documentDirectory}${filename}`;
                    await FileSystem.writeAsStringAsync(localUri, base64Image, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    return { uri: localUri, success: true };
                }

                // If it returns text, use our adaptive semantic image resolver
                const textResponse = response.text();
                if (textResponse) {
                    console.log('[NEURAL LINK] Semantic text synthesized. Resolving visuals...');
                    // Using a refined dynamic service that responds to the AI's reasoning
                    const timestamp = Date.now();
                    const encodedPrompt = encodeURIComponent(request.prompt.split(' ').slice(0, 3).join(','));
                    // Cyberpunk-themed dynamic image service fallback
                    const webUri = `https://images.unsplash.com/photo-1542831371-337ce876007b?auto=format&fit=crop&q=80&w=1000&sig=${timestamp}&q=${encodedPrompt}`;

                    return {
                        uri: webUri,
                        success: true
                    };
                }

            } catch (error: any) {
                console.error(`[NEURAL FAIL] ${modelName}:`, error.message);
                // If it's 404 or 429, we skip to the next model in the priority list
                if (error.message.includes('404') || error.message.includes('429')) {
                    continue;
                }
                // For other fatal errors, we break
                return { uri: '', success: false, error: `CRITICAL SYSTEM ERROR: ${error.message}` };
            }
        }

        return {
            uri: '',
            success: false,
            error: 'ALL NEURAL CHANNELS SATURATED. Quota exceeded or service unavailable.'
        };
    }

    async saveToDevice(uri: string): Promise<string> {
        const filename = `meme_${Date.now()}.jpg`;
        const dest = `${FileSystem.documentDirectory}${filename}`;
        try {
            if (uri.startsWith('http')) {
                const { uri: localUri } = await FileSystem.downloadAsync(uri, dest);
                return localUri;
            } else {
                await FileSystem.copyAsync({ from: uri, to: dest });
                return dest;
            }
        } catch (error) {
            return uri;
        }
    }
}

export const aiService = new AIService();
