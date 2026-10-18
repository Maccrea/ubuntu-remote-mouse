import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, PanResponder, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'expo-sensors';

interface MouseModeProps {
  connected: boolean;
  sendCommand: (payload: any) => void;
}

export default function MouseMode({ connected, sendCommand }: MouseModeProps) {
  const [airActive, setAirActive] = useState(false);
  const [dpi, setDpi] = useState(3.0);
  const dpiRef = useRef(dpi);

  const updateDpi = (newDpi: number) => {
    setDpi(newDpi);
    dpiRef.current = newDpi;
  };

  useEffect(() => {
    let subscription: any = null;

    if (airActive && connected) {
      Gyroscope.setUpdateInterval(16);
      subscription = Gyroscope.addListener(gyroData => {
        const threshold = 0.08;
        const baseMultiplier = -15; 
        let dx = 0; let dy = 0;

        if (Math.abs(gyroData.y) > threshold) dx = -gyroData.y * baseMultiplier * dpiRef.current; 
        if (Math.abs(gyroData.x) > threshold) dy = gyroData.x * baseMultiplier * dpiRef.current; 

        if (dx !== 0 || dy !== 0) sendCommand({ type: 'move', dx, dy });
      });
    } else {
      if (subscription) subscription.remove();
    }
    return () => { if (subscription) subscription.remove(); };
  }, [airActive, connected]);

  const lastPos = useRef({ x: 0, y: 0 });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        lastPos.current = { x: gestureState.x0, y: gestureState.y0 };
      },
      onPanResponderMove: (evt, gestureState) => {
        if (airActive) return;
        const dx = gestureState.moveX - lastPos.current.x;
        const dy = gestureState.moveY - lastPos.current.y;
        sendCommand({ type: 'move', dx: dx * dpiRef.current, dy: dy * dpiRef.current });
        lastPos.current = { x: gestureState.moveX, y: gestureState.moveY };
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.dpiContainer}>
        <Text style={styles.dpiText}>DPI: {dpi.toFixed(1)}</Text>
        <View style={styles.dpiButtons}>
          <TouchableOpacity style={styles.dpiBtn} onPress={() => updateDpi(Math.max(0.5, dpi - 0.5))}>
            <Text style={styles.dpiBtnText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dpiBtn, { marginLeft: 10 }]} onPress={() => updateDpi(dpi + 0.5)}>
            <Text style={styles.dpiBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.trackpad, airActive && styles.trackpadActive]} {...panResponder.panHandlers}>
        {airActive ? (
          <Text style={styles.gyroStatusText}>📳 Sensor Udara Aktif</Text>
        ) : (
          <Text style={styles.trackpadText}>Geser Trackpad</Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.gyroButton, airActive ? styles.gyroButtonOn : styles.gyroButtonOff]} 
        onPress={() => setAirActive(!airActive)}>
        <Text style={styles.buttonText}>
          {airActive ? '⏸ Matikan Sensor' : '🪄 Aktifkan Sensor Udara'}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clickButton} onPress={() => sendCommand({ type: 'click', button: 'left' })}>
          <Text style={styles.buttonText}>Kiri</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.clickButton, styles.rightClick]} onPress={() => sendCommand({ type: 'click', button: 'right' })}>
          <Text style={styles.buttonText}>Kanan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', width: '100%' },
  dpiContainer: { width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  dpiText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  dpiButtons: { flexDirection: 'row' },
  dpiBtn: { backgroundColor: '#0052cc', width: 45, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  dpiBtnText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  trackpad: { width: '90%', height: '40%', backgroundColor: '#1e1e1e', borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  trackpadActive: { backgroundColor: '#0a2342', borderColor: '#0052cc' },
  trackpadText: { color: '#555', fontSize: 18 },
  gyroStatusText: { color: '#00bfff', fontSize: 16, textAlign: 'center' },
  gyroButton: { marginTop: 15, width: '90%', padding: 15, borderRadius: 10, alignItems: 'center' },
  gyroButtonOff: { backgroundColor: '#0052cc' },
  gyroButtonOn: { backgroundColor: '#d9534f' },
  buttonContainer: { flexDirection: 'row', marginTop: 15, width: '90%', justifyContent: 'space-between' },
  clickButton: { backgroundColor: '#333', padding: 20, borderRadius: 10, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  rightClick: { backgroundColor: '#2a2a2a' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});