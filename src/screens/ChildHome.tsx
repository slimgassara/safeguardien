import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { watchFamily, pushLocation, pushSOS } from '../services/realtime';

export default function ChildHome({ familyId }: { familyId: string }) {
  const [features, setFeatures] = useState<any>({});
  const [sending, setSending] = useState(false);

  useEffect(() => watchFamily(familyId, d => setFeatures(d.features ?? {})), [familyId]);

  useEffect(() => {
    let sub: Location.LocationSubscription | undefined;
    (async () => {
      if (!features.gps) return;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 15000, distanceInterval: 20 },
        p => pushLocation(familyId, p.coords.latitude, p.coords.longitude),
      );
    })();
    return () => sub?.remove();
  }, [features.gps, familyId]);

  const onSOS = async () => {
    setSending(true);
    try {
      await Location.requestForegroundPermissionsAsync();
      const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      await pushSOS(familyId, p.coords.latitude, p.coords.longitude);
      Alert.alert('SOS envoyé', 'Tes parents ont été prévenus avec ta position.');
    } catch { Alert.alert('Erreur', "Impossible d'envoyer le SOS."); }
    setSending(false);
  };

  return (
    <View style={s.wrap}>
      <Text style={s.badge}>🛡️ SafeGuardian est actif</Text>
      <Text style={s.state}>GPS : {features.gps ? 'activé' : 'désactivé'}</Text>

      {features.sos !== false && (
        <Pressable style={[s.sos, sending && { opacity: 0.6 }]} onPress={onSOS} disabled={sending}>
          <Text style={s.sosTxt}>SOS</Text>
          <Text style={s.sosSub}>Appuie en cas d'urgence</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#0E1116', alignItems: 'center', justifyContent: 'center', padding: 24 },
  badge: { color: '#3DDC97', fontSize: 16, fontWeight: '700' },
  state: { color: '#9AA4B2', marginTop: 8, marginBottom: 48 },
  sos: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#B42318',
         alignItems: 'center', justifyContent: 'center' },
  sosTxt: { color: '#fff', fontSize: 48, fontWeight: '900' },
  sosSub: { color: '#FFD7D2', marginTop: 6 },
});
