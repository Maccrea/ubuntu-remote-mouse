import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

interface KeyboardModeProps {
  sendCommand: (payload: any) => void;
}

const getMappedKey = (key: string) => {
  const specialKeys: { [key: string]: string } = {
    'Esc': 'esc', 'Tab': 'tab', '↵ Enter': 'enter', '⌫': 'backspace',
    'Space': 'space', '▲': 'up', '▼': 'down', '◀': 'left', '▶': 'right',
    'Home': 'home', 'End': 'end', 'PgUp': 'pgup', 'PgDn': 'pgdn', 'Ins': 'ins',
    'Ctrl': 'ctrl', 'Alt': 'alt', 'Shift': 'shift', 'Win': 'win'
  };
  return key in specialKeys ? specialKeys[key] : key.toLowerCase();
};

const KeyButton = React.memo(({ label, flexValue = 1, isAccent = false, sendCommand }: any) => {
  const [isSticky, setIsSticky] = useState(false); // State untuk Hold (terkunci)
  const [isPressed, setIsPressed] = useState(false); // State untuk pencetan biasa
  const lastTap = useRef(0);

  const handlePressIn = (e: any) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // Jarak waktu double-click (300ms)
    const isModifier = ['Ctrl', 'Alt', 'Shift', 'Win'].includes(label);

    // Cek apakah ini double click dan tombolnya adalah tombol modifier
    if (isModifier && (now - lastTap.current < DOUBLE_TAP_DELAY)) {
      setIsSticky(!isSticky); // Balikkan status kunciannya
      if (!isSticky) {
        sendCommand({ type: 'key_down', key: getMappedKey(label) });
      } else {
        sendCommand({ type: 'key_up', key: getMappedKey(label) });
      }
      lastTap.current = 0; // Reset timer
    } else {
      // Single click biasa
      if (isSticky) {
        // Kalau tombol sedang terkunci, single click akan membukanya
        setIsSticky(false);
        sendCommand({ type: 'key_up', key: getMappedKey(label) });
      } else {
        // Tombol ditekan biasa
        setIsPressed(true);
        sendCommand({ type: 'key_down', key: getMappedKey(label) });
      }
      lastTap.current = now;
    }
  };

  const handlePressOut = (e: any) => {
    e.stopPropagation();
    // Hanya kirim sinyal dilepas (key_up) JIKA tombol tidak sedang terkunci
    if (isPressed && !isSticky) {
      setIsPressed(false);
      sendCommand({ type: 'key_up', key: getMappedKey(label) });
    }
  };

  // Tombol menyala jika dipencet biasa ATAU sedang terkunci (Hold)
  const isActive = isPressed || isSticky;

  return (
    <View
      style={[
        styles.keyButton,
        { flex: flexValue },
        isAccent && styles.accentKey,
        label === 'Space' && styles.spaceKey,
        isActive && styles.pressedKey 
      ]}
      onStartShouldSetResponder={() => true}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      <Text style={[
        styles.keyText,
        isAccent && styles.accentText,
        isActive && styles.pressedText
      ]}>
        {label}
      </Text>
    </View>
  );
});

export default function KeyboardMode({ sendCommand }: KeyboardModeProps) {
  useEffect(() => {
    async function lockToLandscape() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
      StatusBar.setHidden(true, 'none');
    }
    lockToLandscape();

    return () => {
      async function revertToPortrait() {
        await ScreenOrientation.unlockAsync();
        StatusBar.setHidden(false, 'none');
      }
      revertToPortrait();
    };
  }, []);

  return (
    <View style={styles.keyboardContainer}>
      <View style={styles.keyboardRow}>
        {['Esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Ins', '⌫'].map((k) => 
          <KeyButton key={k} label={k} flexValue={k === '⌫' || k === 'Esc' ? 1.5 : 1} isAccent={k === '⌫' || k === 'Esc' || k === 'Ins'} sendCommand={sendCommand} />
        )}
      </View>
      <View style={styles.keyboardRow}>
        {['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'].map((k) => 
          <KeyButton key={k} label={k} flexValue={k === 'Tab' ? 1.5 : 1} sendCommand={sendCommand} />
        )}
      </View>
      <View style={styles.keyboardRow}>
        {['Shift', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", '↵ Enter'].map((k, i) => 
          <KeyButton key={`${k}-${i}`} label={k} flexValue={k === '↵ Enter' ? 2 : k === 'Shift' ? 1.2 : 1} isAccent={k === '↵ Enter' || k === 'Shift'} sendCommand={sendCommand} />
        )}
      </View>
      <View style={styles.keyboardRow}>
        {['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', '▲', 'Shift'].map((k, i) => 
          <KeyButton key={`${k}-${i}`} label={k} flexValue={k === 'Shift' ? 1.5 : 1} isAccent={k === '▲'} sendCommand={sendCommand} />
        )}
      </View>
      <View style={styles.keyboardRow}>
        {['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl', '◀', '▼', '▶', 'Home', 'PgUp', 'PgDn', 'End'].map((k, i) => 
          <KeyButton 
            key={`${k}-${i}`} 
            label={k} 
            flexValue={k === 'Space' ? 3.5 : ['◀', '▼', '▶'].includes(k) ? 0.8 : 1} 
            isAccent={['◀', '▼', '▶', 'Ctrl', 'Win', 'Alt', 'Home', 'PgUp', 'PgDn', 'End'].includes(k)} 
            sendCommand={sendCommand} 
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1, backgroundColor: '#0a1d1a', padding: 4, justifyContent: 'space-between', width: '100%'
  },
  keyboardRow: { flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginBottom: 4 },
  keyButton: { backgroundColor: '#004d40', marginHorizontal: 2, borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#005b4f' },
  accentKey: { backgroundColor: '#00bfa5', borderColor: '#00e5ff' },
  spaceKey: { backgroundColor: '#00796b', borderColor: '#004d40' },
  pressedKey: { backgroundColor: '#ffb300', borderColor: '#ffca28' },
  keyText: { color: '#e0f2f1', fontSize: 13, fontWeight: 'bold' },
  accentText: { color: '#0a1d1a' },
  pressedText: { color: '#000' }
});