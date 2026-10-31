import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS, SONGS, QUICK_PICKS, MIXES, songsById } from './data';
import { Art, Chip, SectionHeader, SongRow } from './ui';

const CHIPS = ['All', 'Music', 'Podcasts', 'Feel good'];

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logoBox}>
          <Icon name="music-note" size={20} color="#fff" />
        </View>
        <Text style={styles.brandText}>Rhythm</Text>
      </View>
      <View style={styles.headerRight}>
        <Icon name="bell-outline" size={26} color={COLORS.text} />
        <View style={styles.profile}>
          <Text style={styles.profileText}>R</Text>
        </View>
      </View>
    </View>
  );
}

function Hero({ onPlay }) {
  const focus = { colors: ['#B45309', '#1E1B4B'], image: 'https://picsum.photos/seed/hero-focus/700/400' };
  return (
    <Pressable style={styles.heroWrap} onPress={onPlay}>
      <Art item={focus} width="100%" height={150} radius={14}>
        <LinearGradient
          colors={['rgba(0,0,0,0.78)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroText}>
          <Text style={styles.heroKicker}>MUSIC TO</Text>
          <Text style={styles.heroTitle}>FOCUS</Text>
          <Text style={styles.heroSub}>Work • Study • Relax</Text>
        </View>
        <View style={styles.heroPlay}>
          <Icon name="play" size={26} color="#fff" />
        </View>
      </Art>
    </Pressable>
  );
}

function MixCard({ mix, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.mixCard}>
      <Art item={mix} width={128} height={128} radius={10}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']}
          style={[StyleSheet.absoluteFill, { top: '45%' }]}
        />
        <Text style={styles.mixName}>{mix.name}</Text>
      </Art>
    </Pressable>
  );
}

export default function HomeScreen({ currentId, isPlaying, onPlaySong, onPlayList }) {
  const [chip, setChip] = useState('All');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {CHIPS.map((c) => (
            <Chip key={c} label={c} active={c === chip} onPress={() => setChip(c)} />
          ))}
        </ScrollView>

        <Hero onPlay={() => onPlayList(songsById(['s5', 's6', 's7', 's9', 's1']), 'Music to Focus')} />

        <SectionHeader title="Quick picks" onSeeAll={() => {}} />
        {QUICK_PICKS.map((s) => (
          <SongRow
            key={s.id}
            song={s}
            active={currentId === s.id}
            onPress={() => onPlaySong(s, QUICK_PICKS, 'Quick picks')}
          />
        ))}

        <SectionHeader title="Mixed for you" onSeeAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        >
          {MIXES.map((m) => (
            <MixCard key={m.id} mix={m} onPress={() => onPlayList(songsById(m.songIds), m.name)} />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: {
    width: 38,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { color: COLORS.text, fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C5C3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  chipsRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },

  heroWrap: { marginHorizontal: 16, marginTop: 4 },
  heroText: { position: 'absolute', left: 16, top: 0, bottom: 0, justifyContent: 'center' },
  heroKicker: { color: '#fff', fontSize: 15, fontWeight: '500', letterSpacing: 1 },
  heroTitle: { color: '#fff', fontSize: 40, fontWeight: '900', letterSpacing: 1, lineHeight: 44 },
  heroSub: { color: '#fff', fontSize: 14, marginTop: 4 },
  heroPlay: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mixCard: { width: 128 },
  mixName: { position: 'absolute', left: 10, bottom: 8, color: '#fff', fontSize: 14, fontWeight: '700' },
});
