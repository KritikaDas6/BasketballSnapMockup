import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Snap } from '@/constants/nba';

type TabBarProps = {
  state: { routes: { name: string }[]; index: number };
  navigation: { navigate: (name: string) => void };
};

const TABS = [
  { name: 'map', label: 'Map', icon: 'location' as const, external: false },
  {
    name: 'chat',
    label: 'Chat',
    icon: 'chatbubble-ellipses' as const,
    badge: 2,
    external: true,
  },
  { name: 'snap', label: '', icon: 'camera' as const, isCapture: true, external: false },
  { name: 'stories', label: 'Stories', icon: 'people' as const, external: false },
  { name: 'index', label: 'NBA', icon: 'basketball' as const, external: false },
];

export function BottomTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRouteName = state.routes[state.index]?.name;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {TABS.map((tab) => {
        const isActive = activeRouteName === tab.name;
        const onPress = () => {
          if (tab.external) {
            router.push('/chat');
          } else {
            navigation.navigate(tab.name);
          }
        };

        if (tab.isCapture) {
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.captureButton}
              onPress={onPress}
              activeOpacity={0.85}>
              <View style={styles.captureRing} />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={tab.name} style={styles.tab} onPress={onPress} activeOpacity={0.7}>
            <View>
              <Ionicons
                name={tab.icon}
                size={24}
                color={isActive ? Snap.yellow : Snap.textSecondary}
              />
              {!!tab.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            {!!tab.label && (
              <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Snap.background,
    borderTopWidth: 1,
    borderTopColor: Snap.border,
    paddingTop: 10,
  },
  tab: {
    alignItems: 'center',
    gap: 4,
    minWidth: 52,
  },
  label: {
    color: Snap.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  labelActive: {
    color: Snap.yellow,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Snap.red,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Snap.text,
    fontSize: 10,
    fontWeight: '700',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -6,
  },
  captureRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Snap.yellow,
    borderWidth: 3,
    borderColor: Snap.text,
  },
});
