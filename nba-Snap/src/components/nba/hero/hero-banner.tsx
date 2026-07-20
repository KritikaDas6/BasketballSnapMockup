import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HERO_COPY, HERO_IMAGE } from '@/constants/hero';
import { Snap } from '@/constants/nba';

export function HeroBanner() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <Image
        source={HERO_IMAGE}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="right"
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.88)']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Text style={styles.headline}>{HERO_COPY.headline}</Text>
        <Text style={styles.subtitle}>{HERO_COPY.subtitle}</Text>

        <Pressable style={styles.primaryCta} onPress={() => router.push('/(tabs)/stories')}>
          <Ionicons name="play" size={14} color={Snap.background} />
          <Text style={styles.primaryCtaText}>{HERO_COPY.primaryCta}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 400,
    marginHorizontal: 16,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
    gap: 8,
  },
  headline: {
    color: Snap.yellow,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: Snap.text,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    maxWidth: '92%',
  },
  primaryCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Snap.yellow,
    borderRadius: 22,
    paddingVertical: 11,
    paddingHorizontal: 18,
    marginTop: 6,
  },
  primaryCtaText: {
    color: Snap.background,
    fontSize: 13,
    fontWeight: '800',
  },
});
