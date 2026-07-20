import { useCallback, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import type { NbaCard } from '@/constants/cards';
import { HoloCard } from './holo-card';
import { CARD_HEIGHT, ITEM_SPACING } from './layout';

type Props = {
  cards: NbaCard[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
};

export function CardCarousel({ cards, activeIndex, onActiveIndexChange }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const scrollX = useSharedValue(activeIndex * ITEM_SPACING);
  const sidePadding = (windowWidth - ITEM_SPACING) / 2;
  const lastReported = useRef(activeIndex);

  const reportIndex = useCallback(
    (rawIndex: number) => {
      const clamped = Math.min(cards.length - 1, Math.max(0, rawIndex));
      if (clamped !== lastReported.current) {
        lastReported.current = clamped;
        onActiveIndexChange(clamped);
      }
    },
    [cards.length, onActiveIndexChange],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Drive the active index directly off the shared scroll value instead of
  // onMomentumScrollEnd/onScrollEndDrag: those touch-momentum events never
  // fire for wheel/trackpad-driven scrolling on web, which would otherwise
  // leave the active card visually centered but the JS state stuck.
  useAnimatedReaction(
    () => Math.round(scrollX.value / ITEM_SPACING),
    (roundedIndex, previous) => {
      if (roundedIndex !== previous) {
        runOnJS(reportIndex)(roundedIndex);
      }
    },
  );

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_SPACING}
      decelerationRate="fast"
      disableIntervalMomentum
      contentContainerStyle={[styles.content, { paddingHorizontal: sidePadding }]}
      style={{ height: CARD_HEIGHT + 40 }}
      scrollEventThrottle={16}
      onScroll={scrollHandler}>
      {cards.map((card, index) => (
        <HoloCard
          key={card.id}
          card={card}
          index={index}
          scrollX={scrollX}
          isActive={index === activeIndex}
        />
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
});
