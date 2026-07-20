import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ChatProvider } from '@/context/chat-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ChatProvider>
      <StatusBar style="light" />
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="story/[playerId]" options={{ animation: 'fade', presentation: 'fullScreenModal' }} />
      </Stack>
    </ChatProvider>
  );
}
