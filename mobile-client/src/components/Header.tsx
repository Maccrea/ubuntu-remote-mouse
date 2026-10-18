import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface HeaderProps {
  connected: boolean;
  mode: 'mouse' | 'keyboard';
  setMode: (mode: 'mouse' | 'keyboard') => void;
}

export default function Header({ connected, mode, setMode }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.status}>
        {connected ? '🟢 Terhubung' : '🔴 Terputus'}
      </Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, mode === 'mouse' && styles.tabActive]} 
          onPress={() => setMode('mouse')}>
          <Text style={styles.tabText}>🖱️ Mouse</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, mode === 'keyboard' && styles.tabActive]} 
          onPress={() => setMode('keyboard')}>
          <Text style={styles.tabText}>⌨️ Keyboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 20, width: '100%' },
  status: { color: 'white', fontSize: 14, marginBottom: 15 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#1e1e1e', borderRadius: 10, overflow: 'hidden' },
  tabBtn: { paddingVertical: 10, paddingHorizontal: 30, backgroundColor: '#1e1e1e' },
  tabActive: { backgroundColor: '#0052cc' },
  tabText: { color: 'white', fontWeight: 'bold' },
});