import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { getFirestore } from './firebase.js';

dotenv.config();

async function seedDatabase() {
  console.log('Connecting to Firebase Admin SDK to seed Firestore...');
  const db = getFirestore();
  
  if (!db) {
    console.error('Failed to connect to Firestore. Check your server/.env credentials!');
    return;
  }

  try {
    const rawSchema = readFileSync('./firebase-schema.json', 'utf8');
    const schema = JSON.parse(rawSchema);

    // Seed Collections
    console.log('Seeding collections...');
    if (schema.collections) {
      for (const [id, data] of Object.entries(schema.collections)) {
        await db.collection('collections').doc(id).set(data);
        console.log(`  ✓ seeded collection: ${id}`);
      }
    }

    // Seed Products
    console.log('Seeding products...');
    if (schema.products) {
      for (const [id, data] of Object.entries(schema.products)) {
        await db.collection('products').doc(id).set(data);
        console.log(`  ✓ seeded product: ${id}`);
      }
    }

    // Seed Users (optional if you want the dummy user)
    console.log('Seeding dummy user...');
    if (schema.users) {
      for (const [uid, data] of Object.entries(schema.users)) {
        await db.collection('users').doc(uid).set(data);
        console.log(`  ✓ seeded dummy user: ${uid}`);
      }
    }

    console.log('✅ Firestore Database successfully populated from firebase-schema.json!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
