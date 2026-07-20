import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { CardShowcaseSection } from '@/components/nba/card-showcase/card-showcase-section';
import { GroupChatCard } from '@/components/nba/group-chat-card';
import { HeroBanner } from '@/components/nba/hero/hero-banner';
import { HubHeader } from '@/components/nba/hub-header';
import { RewardsCard } from '@/components/nba/rewards-card';
import { StoryRow } from '@/components/nba/story-row';
import { Snap } from '@/constants/nba';

export default function NbaHubScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <HubHeader />

        <HeroBanner />

        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>NBA Hub</Text>
            <Text style={styles.seeAll}>See All ›</Text>
          </View>
          <Text style={styles.subtitle}>Your home for NBA on Snapchat</Text>
        </View>

        <StoryRow />

        <GroupChatCard />

        <RewardsCard />

        <CardShowcaseSection />

        <View style={{ height: BottomTabInset }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Snap.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: 20,
    paddingBottom: 24,
  },
  titleBlock: {
    paddingHorizontal: 16,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: Snap.text,
    fontSize: 24,
    fontWeight: '800',
  },
  seeAll: {
    color: Snap.yellow,
    fontSize: 13,
    fontWeight: '700',
  },
  subtitle: {
    color: Snap.textSecondary,
    fontSize: 13,
  },
});
