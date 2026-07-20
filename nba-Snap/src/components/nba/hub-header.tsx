import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Snap } from '@/constants/nba';

const NBA_X_SNAP_LOGO = require('@/assets/images/nba-x-snap-logo.png');
const SNAP_GHOST = require('@/assets/images/snap-ghost.png');

export function HubHeader() {
  return (
    <View style={styles.row}>
      <Image
        source={SNAP_GHOST}
        style={styles.ghost}
        contentFit="contain"
        tintColor={Snap.yellow}
        accessibilityLabel="Snapchat"
      />

      <Image
        source={NBA_X_SNAP_LOGO}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="NBA x Snap"
      />

      <View style={styles.rightIcons}>
        <Image
          source={SNAP_GHOST}
          style={styles.ghostSmall}
          contentFit="contain"
          tintColor={Snap.text}
          accessibilityLabel="Profile"
        />
        <View>
          <Ionicons name="notifications" size={26} color={Snap.text} />
          <View style={styles.badgeDot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 2,
  },
  ghost: {
    width: 34,
    height: 34,
  },
  ghostSmall: {
    width: 28,
    height: 28,
  },
  logo: {
    width: 210,
    height: 52,
    flexShrink: 1,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  badgeDot: {
    position: 'absolute',
    top: -1,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Snap.yellow,
  },
});
