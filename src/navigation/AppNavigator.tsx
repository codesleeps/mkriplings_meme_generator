import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GenerationScreen } from '../screens/GenerationScreen';
import { GalleryScreen } from '../screens/GalleryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { theme } from '../styles/theme';
import { Sparkles, Library, Settings } from 'lucide-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopColor: '#222',
                    height: 80,
                    paddingBottom: 20,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.text.muted,
            }}
        >
            <Tab.Screen
                name="Generate"
                component={GenerationScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
};

export const AppNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Skip auth for now

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Screen name="Auth">
                        {(props) => <AuthScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
                    </Stack.Screen>
                ) : (
                    <Stack.Screen name="Main" component={TabNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
