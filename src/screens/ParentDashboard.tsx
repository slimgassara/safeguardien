import { useEffect, useState } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { ensureFamily, watchFamily, setFeature } from '../services/realtime';

const FEATURES = [
  { key: 'gps', label: 'Localisation GPS' },
  { key: 'appBlock', label: 'Blocage des applications' },
  { key: 'screenTime', label: 'Quotas de temps d\u2019\u00e9cran' },
  { key: 'sos', label: 'Bouton SOS (enfant)' },
];

export default function ParentDashboard({ familyId }: { familyId: string }) {
  const [data, setData] = useState<any>({});
  useEffect(() => { ensureFamily(familyId); return watchFamily(familyId, setData); }, [familyId]);

  const f = data.features ?? {};
  const loc = data.location;
  const sos = data.lastSos;

  return (
    <ScrollView style={s.wrap} contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <Text style={s.h1}>Tableau de bord</Text>

      {sos && Date.now() - sos.ts < 120000 && (
        <View style={s.sos}>
          <Text style={s.sosTxt}>🚨 ALERTE SOS</Text>
          <Text style={s.sosSub}>Position : {sos.lat.toFixed(5)}, {sos.lng.toFixed(5)}</Text>
        </View>
      )}

      <View style={s.card}>
        <Text style={s.cardH}>Position actuelle</Text>
        <Text style={s.val}>{loc ? `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}` : '—'}</Text>
      </View>

      <Text style={s.section}>Fonctionnalités</Text>
      {FEATURES.map(item => (
        <View key={item.key} style={s.row}>
          <Text style={s.label}>{item.label}</Text>
          <Switch value={!!f[item.key]} onValueChange={v => setFeature(familyId, item.key, v)} />
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#0E1116' },
  h1: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 16 },
  sos: { backgroundColor: '#B42318', padding: 16, borderRadius: 16, marginBottom: 16 },
  sosTxt: { color: '#fff', fontSize: 18, fontWeight: '800' },
  sosSub: { color: '#FFD7D2', marginTop: 4 },
  card: { backgroundColor: '#161B22', padding: 16, borderRadius: 16, marginBottom: 20 },
  cardH: { color: '#9AA4B2', fontSize: 13 },
  val: { color: '#4F8CFF', fontSize: 18, fontWeight: '700', marginTop: 6 },
  section: { color: '#9AA4B2', fontSize: 13, marginBottom: 8, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
         backgroundColor: '#161B22', padding: 16, borderRadius: 14, marginBottom: 10 },
  label: { color: '#fff', fontSize: 16 },
});
