import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface KeyboardModeProps {
  sendCommand: (payload: any) => void;
}

export default function KeyboardMode({ sendCommand }: KeyboardModeProps) {
  const handleKeyPress = (key: string) => {
    if (key === 'BACKSPACE') {
      sendCommand({ type: 'press_key', key: 'backspace' });
    } else if (key === 'ENTER') {
      sendCommand({ type: 'press_key', key: 'enter' });
    } else if (key === 'SPACE') {
      sendCommand({ type: 'type_text', text: ' ' });
    } else {
      sendCommand({ type: 'type_text', text: key.toLowerCase() });
    }
  };

  const renderKeyRow = (keys: string[]) => (
    <View style={styles.keyboardRow}>
      {keys.map((key) => (
        <TouchableOpacity 
          key={key} 
          style={[styles.keyButton, key.length > 1 ? styles.specialKey : null]} 
          onPress={() => handleKeyPress(key)}
        >
          <Text style={styles.keyText}>
            {key === 'BACKSPACE' ? '⌫' : key === 'ENTER' ? '↵' : key}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.keyboardArea}>
      {renderKeyRow(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])}
      {renderKeyRow(['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'])}
      {renderKeyRow(['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'])}
      {renderKeyRow(['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'])}
      {renderKeyRow(['SPACE', 'ENTER'])}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardArea: { flex: 1, justifyContent: 'center', paddingHorizontal: 5, paddingBottom: 20, width: '100%' },
  keyboardRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  keyButton: { backgroundColor: '#333', marginHorizontal: 4, flex: 1, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  specialKey: { flex: 2, backgroundColor: '#444' },
  keyText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});