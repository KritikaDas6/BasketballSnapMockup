import { Tabs } from 'expo-router';

import { BottomTabBar } from '@/components/nba/bottom-tab-bar';

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <BottomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="snap" />
      <Tabs.Screen name="stories" />
    </Tabs>
  );
}
