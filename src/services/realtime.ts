import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const famRef = (familyId: string) => doc(db, 'families', familyId);

export function ensureFamily(familyId: string) {
  return setDoc(famRef(familyId), { createdAt: serverTimestamp() }, { merge: true });
}

export function watchFamily(familyId: string, cb: (data: any) => void) {
  return onSnapshot(famRef(familyId), snap => cb(snap.data() ?? {}));
}

export function setFeature(familyId: string, key: string, value: boolean) {
  return updateDoc(famRef(familyId), { [`features.${key}`]: value });
}

export function pushLocation(familyId: string, lat: number, lng: number) {
  return updateDoc(famRef(familyId), { location: { lat, lng, ts: Date.now() } });
}

export function pushSOS(familyId: string, lat: number, lng: number, audioUri?: string) {
  return updateDoc(famRef(familyId), {
    lastSos: { lat, lng, audioUri: audioUri ?? null, ts: Date.now() },
  });
}
