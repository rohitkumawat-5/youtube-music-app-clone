import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS, SONGS, LYRICS, formatTime } from './data';
import { Art, Slider, SongRow } from './ui';

const TOP = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 56;
// The player covers the whole screen, so clear the home indicator / gesture bar itself.
const BOTTOM = Platform.OS === 'ios' ? 22 : 14;
const PANELS = [
  { key: 'upnext', label: 'UP NEXT' },
  { key: 'lyrics', label: 'LYRICS' },
  { key: 'related', label: 'RELATED' },
];

// ---------- bottom "UP NEXT / LYRICS / RELATED" strip on the main player ----------
function PanelTabsStrip({ onPick }) {
  return (
    <View style={styles.stripWrap}>
      {PANELS.map((p, i) => (
        <Pressable key={p.key} style={styles.stripItem} onPress={() => onPick(p.key)}>
          <Text style={[styles.stripText, i === 0 && styles.stripTextOn]}>{p.label}</Text>
          {i === 0 && <View style={styles.stripUnderline} />}
        </Pressable>
      ))}
    </View>
  );
}

// ---------- panel view (reference phone 5) ----------
function Panel({ panel, setPanel, queue, index, queueTitle, isPlaying, progress, onSelectIndex, onToggle, onCollapse }) {
  const current = queue[index];
  // Songs not currently queued first, then the rest — never the song that's playing.
  const related = [
    ...SONGS.filter((s) => !queue.some((q) => q.id === s.id)),
    ...SONGS.filter((s) => queue.some((q) => q.id === s.id) && s.id !== current.id),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={[styles.panelTabs, { paddingTop: TOP }]}>
        {PANELS.map((p) => {
          const on = p.key === panel;
          return (
            <Pressable key={p.key} style={styles.panelTab} onPress={() => setPanel(p.key)}>
              <Text style={[styles.panelTabText, on && { color: COLORS.text }]}>{p.label}</Text>
              {on && <View style={styles.panelUnderline} />}
            </Pressable>
          );
        })}
      </View>

      {panel === 'upnext' && (
        <>
          <View style={styles.playingFrom}>
            <View>
              <Text style={styles.playingFromLabel}>Playing from</Text>
              <Text style={styles.playingFromTitle}>{queueTitle}</Text>
            </View>
            <Pressable style={styles.saveBtn}>
              <Icon name="bookmark-outline" size={18} color={COLORS.text} />
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
            {queue.map((s, i) => {
              const active = i === index;
              return (
                <SongRow
                  key={`${s.id}-${i}`}
                  song={s}
                  active={active}
                  onPress={() => onSelectIndex(i)}
                  left={
                    <View style={styles.leftSlot}>
                      <Icon
                        name={active ? 'equalizer' : 'menu'}
                        size={active ? 22 : 20}
                        color={active ? COLORS.red : COLORS.muted}
                      />
                    </View>
                  }
                  right={<Icon name="menu" size={22} color={COLORS.sub} style={{ paddingHorizontal: 4 }} />}
                />
              );
            })}
          </ScrollView>
        </>
      )}

      {panel === 'lyrics' && (
        <ScrollView contentContainerStyle={styles.lyricsWrap} showsVerticalScrollIndicator={false}>
          <Text style={styles.lyricsHeading}>{current.title}</Text>
          {LYRICS.map((line, i) => (
            <Text key={i} style={[styles.lyricLine, i === 2 && styles.lyricLineActive]}>
              {line || ' '}
            </Text>
          ))}
        </ScrollView>
      )}

      {panel === 'related' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>
          {related.map((s) => (
            <SongRow key={s.id} song={s} />
          ))}
        </ScrollView>
      )}

      {/* collapsed now-playing bar */}
      <Pressable onPress={onCollapse} style={styles.collapsed}>
        <View style={styles.collapsedTrack}>
          <View style={[styles.collapsedFill, { width: `${Math.min(1, progress) * 100}%` }]} />
        </View>
        <View style={styles.collapsedRow}>
          <Art item={current} size={42} radius={6} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.collapsedTitle} numberOfLines={1}>{current.title}</Text>
            <Text style={styles.collapsedArtist} numberOfLines={1}>{current.artist}</Text>
          </View>
          <Pressable onPress={onToggle} hitSlop={8} style={{ paddingHorizontal: 10 }}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={30} color={COLORS.text} />
          </Pressable>
          <Icon name="chevron-down" size={26} color={COLORS.sub} />
        </View>
      </Pressable>
    </View>
  );
}

// ---------- main player (reference phone 4) ----------
export default function PlayerScreen({
  queue,
  index,
  queueTitle,
  isPlaying,
  position,
  duration,
  statusText,
  isError,
  shuffle,
  repeat,
  onToggle,
  onNext,
  onPrev,
  onSeek,
  onShuffle,
  onRepeat,
  onSelectIndex,
  onClose,
}) {
  const { width, height } = useWindowDimensions();
  const [panel, setPanel] = useState(null); // null | 'upnext' | 'lyrics' | 'related'
  const [mode, setMode] = useState('Song');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const song = queue[index];

  // Back button: close the panel first, then the player.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (panel) setPanel(null);
      else onClose();
      return true;
    });
    return () => sub.remove();
  }, [panel]);

  if (!song) return null;
  const progress = duration > 0 ? position / duration : 0;

  if (panel) {
    return (
      <Panel
        panel={panel}
        setPanel={setPanel}
        queue={queue}
        index={index}
        queueTitle={queueTitle}
        isPlaying={isPlaying}
        progress={progress}
        onSelectIndex={onSelectIndex}
        onToggle={onToggle}
        onCollapse={() => setPanel(null)}
      />
    );
  }

  const artSize = Math.min(width - 72, height * 0.37);

  return (
    <LinearGradient
      colors={['#4A0E16', '#1B080C', '#0B0B0D']}
      locations={[0, 0.45, 1]}
      style={{ flex: 1 }}
    >
      <View style={[styles.topBar, { paddingTop: TOP + 6 }]}>
        <Pressable onPress={onClose} hitSlop={10}>
          <Icon name="chevron-down" size={32} color={COLORS.text} />
        </Pressable>

        <View style={styles.modeToggle}>
          {['Song', 'Video'].map((m) => {
            const on = m === mode;
            return (
              <Pressable key={m} onPress={() => setMode(m)} style={[styles.modeBtn, on && styles.modeBtnOn]}>
                <Text style={[styles.modeText, on && { fontWeight: '700' }]}>{m}</Text>
              </Pressable>
            );
          })}
        </View>

        <Icon name="dots-vertical" size={26} color={COLORS.text} />
      </View>

      <View style={styles.artWrap}>
        <Art item={song} width={artSize} height={artSize} radius={16}>
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.65)']}
            style={[StyleSheet.absoluteFill, { top: '40%' }]}
          />
          <View style={styles.artOverlay}>
            <Text style={styles.artTitle} numberOfLines={1}>{song.title.toUpperCase()}</Text>
            <Text style={styles.artSub} numberOfLines={1}>{queueTitle.toUpperCase()}</Text>
          </View>
        </Art>
      </View>

      <View style={styles.meta}>
        <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
        <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
        {!!statusText && (
          <Text style={[styles.statusLine, isError && { color: COLORS.red }]} numberOfLines={2}>
            {statusText}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          hitSlop={8}
          onPress={() => {
            setLiked(!liked);
            setDisliked(false);
          }}
        >
          <Icon name={liked ? 'thumb-up' : 'thumb-up-outline'} size={26} color={liked ? COLORS.red : COLORS.text} />
        </Pressable>
        <Pressable
          hitSlop={8}
          onPress={() => {
            setDisliked(!disliked);
            setLiked(false);
          }}
        >
          <Icon name={disliked ? 'thumb-down' : 'thumb-down-outline'} size={26} color={COLORS.text} />
        </Pressable>
        <Icon name="message-text-outline" size={26} color={COLORS.text} />
        <Icon name="plus-box-outline" size={26} color={COLORS.text} />
        <Icon name="share-outline" size={26} color={COLORS.text} />
      </View>

      <View style={styles.sliderBlock}>
        <Slider value={position} max={duration} onSeek={onSeek} />
        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={onShuffle} hitSlop={8}>
          <Icon name="shuffle-variant" size={26} color={shuffle ? COLORS.red : COLORS.text} />
        </Pressable>
        <Pressable onPress={onPrev} hitSlop={8}>
          <Icon name="skip-previous" size={40} color={COLORS.text} />
        </Pressable>
        <Pressable onPress={onToggle} style={styles.playBtn}>
          <Icon name={isPlaying ? 'pause' : 'play'} size={40} color="#fff" />
        </Pressable>
        <Pressable onPress={onNext} hitSlop={8}>
          <Icon name="skip-next" size={40} color={COLORS.text} />
        </Pressable>
        <Pressable onPress={onRepeat} hitSlop={8}>
          <Icon name={repeat ? 'repeat-once' : 'repeat'} size={26} color={repeat ? COLORS.red : COLORS.text} />
        </Pressable>
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ paddingBottom: BOTTOM }}>
        <PanelTabsStrip onPick={setPanel} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 20,
    padding: 3,
  },
  modeBtn: { paddingHorizontal: 22, paddingVertical: 7, borderRadius: 17 },
  modeBtnOn: { backgroundColor: COLORS.red },
  modeText: { color: COLORS.text, fontSize: 14.5 },

  artWrap: { alignItems: 'center', marginTop: 18 },
  artOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 22 },
  artTitle: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: 6 },
  artSub: { color: 'rgba(255,255,255,0.8)', fontSize: 10.5, letterSpacing: 3, marginTop: 6 },

  meta: { paddingHorizontal: 28, marginTop: 24 },
  songTitle: { color: COLORS.text, fontSize: 26, fontWeight: '700' },
  songArtist: { color: COLORS.sub, fontSize: 16, marginTop: 4 },
  statusLine: { color: COLORS.sub, fontSize: 13, marginTop: 6 },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginTop: 22,
  },

  sliderBlock: { paddingHorizontal: 24, marginTop: 18 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  time: { color: COLORS.sub, fontSize: 12.5 },

  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 14,
  },
  playBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stripWrap: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  stripItem: { flex: 1, alignItems: 'center', paddingTop: 16 },
  stripText: { color: COLORS.sub, fontSize: 12.5, fontWeight: '600', letterSpacing: 0.4, paddingBottom: 14 },
  stripTextOn: { color: COLORS.text },
  stripUnderline: { position: 'absolute', bottom: 0, left: '16%', right: '16%', height: 3, backgroundColor: COLORS.red },

  // panel
  panelTabs: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  panelTab: { flex: 1, alignItems: 'center', paddingTop: 14 },
  panelTabText: { color: COLORS.sub, fontSize: 13, fontWeight: '600', paddingBottom: 12 },
  panelUnderline: { position: 'absolute', bottom: 0, left: '14%', right: '14%', height: 3, backgroundColor: COLORS.red },

  playingFrom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  playingFromLabel: { color: COLORS.sub, fontSize: 13 },
  playingFromTitle: { color: COLORS.text, fontSize: 18, fontWeight: '600', marginTop: 2 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  saveText: { color: COLORS.text, fontSize: 14, fontWeight: '500' },
  leftSlot: { width: 28, alignItems: 'center', marginRight: 8 },

  lyricsWrap: { padding: 24, paddingBottom: 40 },
  lyricsHeading: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 18 },
  lyricLine: { color: COLORS.muted, fontSize: 22, fontWeight: '700', lineHeight: 34 },
  lyricLineActive: { color: COLORS.text },

  collapsed: { backgroundColor: COLORS.surface2, paddingBottom: BOTTOM },
  collapsedTrack: { height: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
  collapsedFill: { height: 2, backgroundColor: COLORS.red },
  collapsedRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  collapsedTitle: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  collapsedArtist: { color: COLORS.sub, fontSize: 12.5, marginTop: 1 },
});
