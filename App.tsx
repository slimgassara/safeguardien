import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ParentDashboard from './src/screens/ParentDashboard';
import ChildHome from './src/screens/ChildHome';

export default function App() {
  const [mode, setMode] = useState<'parent' | 'child' | null | undefined>(undefined);
  const [familyId, setFamilyId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem('mode'), AsyncStorage.getItem('familyId')])
      .then(([m, f]) => { setMode((m as any) ?? null); setFamilyId(f); });
  }, []);

  const choose = async (m: 'parent' | 'child', fid: string) => {
    await AsyncStorage.multiSet([['mode', m], ['familyId', fid]]);
    setMode(m); setFamilyId(fid);
  };

  if (mode === undefined) return <Center><Text style={{ color: '#fff' }}>…</Text></Center>;
  if (!mode || !familyId) return <ModePicker onChoose={choose} />;
  return mode === 'parent'
    ? <ParentDashboard familyId={familyId} />
    : <ChildHome familyId={familyId} />;
}

function ModePicker({ onChoose }: { onChoose: (m: 'parent'|'child', f: string) => void }) {
  const [code] = useState('demo-famille');
  return (
    <Center>
      <Text style={styles.title}>SafeGuardian</Text>
      <Text style={styles.sub}>Code famille (identique sur les 2 téléphones) :</Text>
      <Text style={styles.code}>{code}</Text>
      <Pressable style={styles.btnP} onPress={() => onChoose('parent', code)}>
        <Text style={styles.btnTxt}>Je suis le PARENT</Text>
      </Pressable>
      <Pressable style={styles.btnC} onPress={() => onChoose('child', code)}>
        <Text style={styles.btnTxt}>Je suis l'ENFANT</Text>
      </Pressable>
    </Center>
  );
}

const Center = ({ children }: any) => <View style={styles.center}>{children}</View>;
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0E1116' },
  title: { fontSize: 34, fontWeight: '800', color: '#fff', marginBottom: 8 },
  sub: { color: '#9AA4B2', marginTop: 24 },
  code: { color: '#4F8CFF', fontSize: 20, fontWeight: '700', marginVertical: 8 },
  btnP: { backgroundColor: '#4F8CFF', padding: 16, borderRadius: 16, marginTop: 24, width: 260 },
  btnC: { backgroundColor: '#2A3240', padding: 16, borderRadius: 16, marginTop: 12, width: 260 },
  btnTxt: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 16 },
});
