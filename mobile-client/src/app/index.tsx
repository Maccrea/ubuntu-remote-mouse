import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import MouseMode from '../components/MouseMode';
import KeyboardMode from '../components/KeyboardMode';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [mode, setMode] = useState<'mouse' | 'keyboard'>('mouse');
  
  const ws = useRef<WebSocket | null>(null);
  
  const SERVER_IP = '192.168.18.155';
  const SERVER_PORT = '8000';

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const connectWebSocket = () => {
    ws.current = new WebSocket(`ws://${SERVER_IP}:${SERVER_PORT}/ws`);

    ws.current.onopen = () => setConnected(true);
    ws.current.onclose = () => {
      setConnected(false);
      setTimeout(connectWebSocket, 2000); 
    };
  };

  const sendCommand = (payload: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(payload));
    }
  };

  return (
    <View style={styles.container}>
      <Header connected={connected} mode={mode} setMode={setMode} />
      
      {mode === 'mouse' ? (
        <MouseMode connected={connected} sendCommand={sendCommand} />
      ) : (
        <KeyboardMode sendCommand={sendCommand} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 40, alignItems: 'center' },
});