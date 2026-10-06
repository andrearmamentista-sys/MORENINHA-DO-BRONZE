import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const cfg = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(cfg);
const db = getFirestore(app, cfg.firestoreDatabaseId);

async function updateTheme() {
  await setDoc(
    doc(db, 'settings', 'main'),
    {
      themeBgColor: '#07152b',
      themePrimaryColor: 'blue',
      themeTextColor: '#ffffff',
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  console.log('✅ Firestore settings updated to luxury blue palette in database!');
  process.exit(0);
}

updateTheme().catch((err) => {
  console.error(err);
  process.exit(1);
});
