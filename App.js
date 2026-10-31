import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, BackHandler } from 'react-native';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

import { COLORS } from './screens/ytmusic/data';
import HomeScreen from './screens/ytmusic/HomeScreen';
import ExploreScreen from './screens/ytmusic/ExploreScreen';
import LibraryScreen from './screens/ytmusic/LibraryScreen';
import PlayerScreen from './screens/ytmusic/PlayerScreen';
import { BottomNav, MiniPlayer } from './screens/ytmusic/Chrome';

const ANDROID_TOP = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;
const LOAD_TIMEOUT_MS = 12000; // if a track hasn't loaded by then, tell the user

export default function App() {
  const [tab, setTab] = useState('home');

  // ---- playback state ----
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [queueTitle, setQueueTitle] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); // seconds
  const [duration, setDuration] = useState(0); // seconds (real length of the loaded audio)
  const [audioState, setAudioState] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'error'
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);

  const current = queue[index];

  const playerRef = useRef(null);
  const loadTimer = useRef(null);
  const live = useRef({});
  live.current = { queue, index, shuffle, repeat, current };

  // ---- create ONE real audio player for the whole app ----
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

    const player = createAudioPlayer(null, { updateInterval: 500 });
    playerRef.current = player;

    const sub = player.addListener('playbackStatusUpdate', (st) => {
      setPosition(Math.floor(st.currentTime || 0));
      if (st.duration > 0) setDuration(st.duration);

      if (st.isLoaded) {
        clearTimeout(loadTimer.current);
        setAudioState((s) => (s === 'error' ? s : 'ready'));
      }
      if (st.didJustFinish) finishedRef.current();
    });

    return () => {
      clearTimeout(loadTimer.current);
      sub.remove();
      player.remove();
    };
  }, []);

  // ---- load a song into the player and start it ----
  const loadAndPlay = useCallback((song) => {
    const player = playerRef.current;
    if (!player || !song) return;

    setPosition(0);
    setDuration(0);
    setAudioState('loading');
    clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => {
      setAudioState((s) => (s === 'loading' ? 'error' : s));
    }, LOAD_TIMEOUT_MS);

    player.replace(song.audio);
    player.play();
    setIsPlaying(true);
  }, []);

  const goTo = useCallback(
    (i) => {
      const q = live.current.queue;
      if (!q[i]) return;
      setIndex(i);
      loadAndPlay(q[i]);
    },
    [loadAndPlay]
  );

  const next = useCallback(() => {
    const { queue: q, index: i, shuffle: sh } = live.current;
    if (!q.length) return;
    if (sh && q.length > 1) {
      let r = i;
      while (r === i) r = Math.floor(Math.random() * q.length);
      goTo(r);
    } else {
      goTo((i + 1) % q.length);
    }
  }, [goTo]);

  const prev = useCallback(() => {
    const { queue: q, index: i } = live.current;
    if (!q.length) return;
    // like most players: if we're a few seconds in, restart; otherwise go back
    if (playerRef.current && playerRef.current.currentTime > 4) {
      playerRef.current.seekTo(0);
      setPosition(0);
      return;
    }
    goTo((i - 1 + q.length) % q.length);
  }, [goTo]);

  // When a song ends: repeat it, or move on.
  const finishedRef = useRef(() => {});
  finishedRef.current = () => {
    if (live.current.repeat && playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
      setIsPlaying(true);
    } else {
      next();
    }
  };

  const playList = (list, title, startAt = 0) => {
    if (!list.length) return;
    setQueue(list);
    setQueueTitle(title);
    setIndex(startAt);
    loadAndPlay(list[startAt]);
  };

  const playSong = (song, list, title) => {
    const i = Math.max(0, list.findIndex((s) => s.id === song.id));
    playList(list, title, i);
  };

  const toggle = () => {
    const player = playerRef.current;
    if (!player || !current) return;
    if (audioState === 'error') {
      loadAndPlay(current); // try again
      return;
    }
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const seek = (sec) => {
    const player = playerRef.current;
    if (!player || duration <= 0) return;
    const target = Math.min(sec, Math.max(0, duration - 1));
    player.seekTo(target);
    setPosition(target);
  };

  // Android back: leave a non-home tab first. (The player registers its own handler.)
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (tab !== 'home') {
        setTab('home');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [tab]);

  const common = {
    currentId: current?.id,
    isPlaying,
    onPlaySong: playSong,
    onPlayList: playList,
  };

  const statusText =
    audioState === 'loading'
      ? 'Buffering…'
      : audioState === 'error'
      ? "Can't load audio — check internet, then tap play"
      : '';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={[styles.safe, { paddingTop: ANDROID_TOP }]}>
        <View style={{ flex: 1 }}>
          {tab === 'home' && <HomeScreen {...common} />}
          {tab === 'explore' && <ExploreScreen {...common} />}
          {tab === 'library' && <LibraryScreen {...common} />}
        </View>

        <MiniPlayer
          song={current}
          isPlaying={isPlaying}
          progress={duration > 0 ? position / duration : 0}
          statusText={statusText}
          isError={audioState === 'error'}
          onToggle={toggle}
          onNext={next}
          onOpen={() => setPlayerOpen(true)}
        />
        <BottomNav active={tab} onChange={setTab} />
      </SafeAreaView>

      {playerOpen && current && (
        <View style={StyleSheet.absoluteFill}>
          <PlayerScreen
            queue={queue}
            index={index}
            queueTitle={queueTitle}
            isPlaying={isPlaying}
            position={position}
            duration={duration}
            statusText={statusText}
            isError={audioState === 'error'}
            shuffle={shuffle}
            repeat={repeat}
            onToggle={toggle}
            onNext={next}
            onPrev={prev}
            onSeek={seek}
            onShuffle={() => setShuffle((s) => !s)}
            onRepeat={() => setRepeat((r) => !r)}
            onSelectIndex={goTo}
            onClose={() => setPlayerOpen(false)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  safe: { flex: 1, backgroundColor: COLORS.bg },
});
