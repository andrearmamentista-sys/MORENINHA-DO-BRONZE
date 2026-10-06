import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_STAFF,
  INITIAL_BOOKINGS
} from '../src/data/initialData.js';

const configPath = join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(readFileSync(configPath, 'utf8'));

console.log('🔥 Conectando ao Firebase Firestore:', firebaseConfig.firestoreDatabaseId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seedDatabase() {
  try {
    console.log('⚙️ Gravando configurações do estúdio (settings/main)...');
    await setDoc(doc(db, 'settings', 'main'), {
      ...INITIAL_SETTINGS,
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Configurações gravadas com sucesso!');

    console.log('💆 Limpando e sincronizando procedimentos solicitados (Apenas Banho de Lua e Bronze Marquinha VIP)...');
    const existingServices = await getDocs(collection(db, 'services'));
    const validIds = new Set(INITIAL_SERVICES.map(s => s.id));
    for (const snap of existingServices.docs) {
      if (!validIds.has(snap.id)) {
        await deleteDoc(doc(db, 'services', snap.id));
        console.log(`  🗑️ Removido procedimento descontinuado: ${snap.id} (${snap.data().title})`);
      }
    }

    for (const service of INITIAL_SERVICES) {
      await setDoc(doc(db, 'services', service.id), service);
      console.log(`  ✓ Serviço salvo: ${service.title} (R$ ${service.price}) com opções por hora`);
    }

    console.log('🛍️ Gravando catálogo ampliado da Boutique Sensual & Acessórios VIP (products)...');
    for (const product of INITIAL_PRODUCTS) {
      await setDoc(doc(db, 'products', product.id), product);
      console.log(`  ✓ Produto salvo: ${product.name} (R$ ${product.price})`);
    }

    console.log('👩‍⚕️ Gravando equipe de especialistas do bronze (staff)...');
    for (const member of INITIAL_STAFF) {
      await setDoc(doc(db, 'staff', member.id), member);
      console.log(`  ✓ Profissional salva: ${member.name} (${member.role})`);
    }

    console.log('📅 Gravando agendamentos iniciais para teste de agenda e anti-dupla reserva...');
    for (const booking of INITIAL_BOOKINGS) {
      await setDoc(doc(db, 'bookings', booking.id), booking);
      console.log(`  ✓ Agendamento salvo: ${booking.clientName} em ${booking.date} às ${booking.time}`);
    }

    console.log('👑 Registrando administradora mestre...');
    await setDoc(doc(db, 'admins', 'andrearmamentista'), {
      email: 'andrearmamentista@gmail.com',
      role: 'superadmin',
      name: 'André Armamentista',
      configuredAt: new Date().toISOString()
    });

    console.log('\n🎉 TODOS OS DADOS FORAM CONFIGURADOS COM SUCESSO NO BANCO DE DADOS FIREBASE!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao configurar dados no Firestore:', error);
    process.exit(1);
  }
}

seedDatabase();
