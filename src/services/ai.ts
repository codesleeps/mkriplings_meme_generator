import * as FileSystem from 'expo-file-system';

export interface MemeRequest {
    imageUri?: string;
    prompt: string;
    style?: string;
}

export interface MemeResponse {
    uri: string;
    success: boolean;
    error?: string;
}

class AIService {
    private readonly MODEL_NAME = 'gemini-2.5-flash-image';

    /**
     * Generates a meme based on user instructions and an optional base image.
     * This simulates a call to the "Nano Banana" (Gemini 2.5 Flash Image) model.
     */
    async generateMeme(request: MemeRequest): Promise<MemeResponse> {
        console.log(`Generating meme using ${this.MODEL_NAME} with prompt: ${request.prompt}`);

        try {
            // In a real app, you would send the image and prompt to your backend
            // which interacts with Google Gemini API.
            // Here we simulate the process and a delay.
            await new Promise(resolve => setTimeout(resolve, 3000));

            // For demonstration purposes, if an image is provided, we'll "process" it.
            // If no image is provided, we "generate" one.

            // Since we can't actually run the AI here, we'll return a placeholder or 
            // the original image with a simulated overlay (metadata).

            // Return a success response with a dummy URI for now
            // In a real scenario, this would be the URI of the generated image 
            // returned from the API and saved to local storage.
            return {
                uri: request.imageUri || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1', // Placeholder cyberpunk image
                success: true
            };
        } catch (error) {
            console.error('AI Generation failed:', error);
            return {
                uri: '',
                success: false,
                error: 'Failed to generate meme. Please try again.'
            };
        }
    }

    /**
     * Helper to download/cache the generated image
     */
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
            console.error('Save to device failed:', error);
            return uri;
        }
    }
}

export const aiService = new AIService();
