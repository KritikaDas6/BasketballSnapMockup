import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { RARITY_STYLES, type NbaCard } from '@/constants/cards';
import { Snap } from '@/constants/nba';
import { CARD_HEIGHT, CARD_WIDTH, ITEM_SPACING } from './layout';

type Props = {
  card: NbaCard;
  index: number;
  scrollX: SharedValue<number>;
  isActive: boolean;
};

export function HoloCard({ card, index, scrollX, isActive }: Props) {
  const rarity = RARITY_STYLES[card.rarity];

  // Normalized distance of this card from the currently centered card:
  // 0 = focused, -1 = one slot to the left, +1 = one slot to the right.
  const distance = useDerivedValue(() => scrollX.value / ITEM_SPACING - index);

  // Finger position over the active card, normalized 0..1. Rests at the
  // center (0.5, 0.5) which maps to zero tilt.
  const pointerX = useSharedValue(0.5);
  const pointerY = useSharedValue(0.5);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => isActive,
        onMoveShouldSetPanResponder: () => isActive,
        onPanResponderMove: (_event, gesture) => {
          const { locationX, locationY } = _event.nativeEvent;
          pointerX.value = clamp01(locationX / CARD_WIDTH);
          pointerY.value = clamp01(locationY / CARD_HEIGHT);
          void gesture;
        },
        onPanResponderRelease: () => {
          pointerX.value = withSpring(0.5, { damping: 14 });
          pointerY.value = withSpring(0.5, { damping: 14 });
        },
        onPanResponderTerminate: () => {
          pointerX.value = withSpring(0.5, { damping: 14 });
          pointerY.value = withSpring(0.5, { damping: 14 });
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isActive],
  );

  const carouselStyle = useAnimatedStyle(() => {
    const d = distance.value;
    const scale = interpolate(d, [-1, 0, 1], [0.8, 1.05, 0.8], Extrapolation.CLAMP);
    const rotateY = interpolate(d, [-1, 0, 1], [30, 0, -30], Extrapolation.CLAMP);
    const skewY = interpolate(d, [-1, 0, 1], [5, 0, -5], Extrapolation.CLAMP);
    const opacity = interpolate(d, [-1, -0.4, 0, 0.4, 1], [0.45, 0.75, 1, 0.75, 0.45], Extrapolation.CLAMP);
    const translateY = interpolate(d, [-1, 0, 1], [10, 0, 10], Extrapolation.CLAMP);
    const zIndex = interpolate(d, [-1, 0, 1], [1, 20, 1], Extrapolation.CLAMP);

    // Dynamic finger-tilt only meaningfully applies to the focused card; on
    // side cards the pointer stays centered so this contributes ~0deg.
    const tiltX = interpolate(pointerY.value, [0, 1], [8, -8], Extrapolation.CLAMP);
    const tiltY = interpolate(pointerX.value, [0, 1], [-8, 8], Extrapolation.CLAMP);

    return {
      opacity,
      zIndex,
      transform: [
        { perspective: 700 },
        { translateY },
        { scale },
        { rotateY: `${rotateY + tiltY}deg` },
        { rotateX: `${tiltX}deg` },
        { skewY: `${skewY}deg` },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(distance.value, [-0.3, 0, 0.3], [0, 1, 0], Extrapolation.CLAMP),
  }));

  const foilShiftStyle = useAnimatedStyle(() => {
    const x = interpolate(pointerX.value, [0, 1], [-CARD_WIDTH * 0.6, CARD_WIDTH * 0.6]);
    const y = interpolate(pointerY.value, [0, 1], [-CARD_HEIGHT * 0.6, CARD_HEIGHT * 0.6]);
    return { transform: [{ translateX: x }, { translateY: y }, { rotate: '25deg' }] };
  });

  const glareStyle = useAnimatedStyle(() => {
    const strength = interpolate(
      Math.abs(pointerX.value - 0.5) + Math.abs(pointerY.value - 0.5),
      [0, 0.5],
      [0.05, 0.5],
      Extrapolation.CLAMP,
    );
    return { opacity: strength };
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[styles.card, { boxShadow: `0px 10px 20px ${withAlpha(rarity.glow, 0.45)}` }, carouselStyle]}
        {...(isActive ? panResponder.panHandlers : null)}>
        <Animated.View style={[styles.glowRing, { borderColor: rarity.glow }, glowStyle]} />

        {/* Full trading-card art already includes name / team / position. */}
        <Image source={card.image} style={styles.image} contentFit="cover" />

        {/* Moving rainbow foil sheen, driven by finger position on the active card. */}
        <View style={[styles.foilMask, styles.noPointerEvents]}>
          <Animated.View style={[styles.foilLayer, foilShiftStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,0,200,0.35)', 'rgba(0,229,255,0.35)', 'rgba(255,215,0,0.4)', 'rgba(255,252,0,0.35)', 'transparent']}
              locations={[0, 0.2, 0.45, 0.65, 0.85, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.foilGradient}
            />
          </Animated.View>
          <Animated.View style={[styles.glare, glareStyle]} />
        </View>

        <View style={styles.rarityBadge}>
          <View style={[styles.rarityDot, { backgroundColor: rarity.glow }]} />
          <Text style={[styles.rarityText, { color: rarity.glow }]}>{rarity.label}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

function clamp01(value: number) {
  'worklet';
  return Math.min(1, Math.max(0, value));
}

function withAlpha(hex: string, alpha: number) {
  const parsed = hex.replace('#', '');
  const r = parseInt(parsed.slice(0, 2), 16);
  const g = parseInt(parsed.slice(2, 4), 16);
  const b = parseInt(parsed.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  wrapper: {
    width: ITEM_SPACING,
    height: CARD_HEIGHT + 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: Snap.cardElevated,
  },
  glowRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    borderWidth: 2,
    zIndex: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  foilMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: 18,
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  foilLayer: {
    position: 'absolute',
    width: CARD_WIDTH * 2.4,
    height: CARD_HEIGHT * 2.4,
    left: -CARD_WIDTH * 0.7,
    top: -CARD_HEIGHT * 0.7,
  },
  foilGradient: {
    flex: 1,
  },
  glare: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  rarityBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rarityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
