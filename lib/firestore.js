// lib/firestore.js — Firebase Admin SDK (server-side only)
import admin from 'firebase-admin';

let db = null;

function getDb() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  db = admin.firestore();
  return db;
}

/**
 * Save a new lead document.
 * @param {object} leadData
 */
export async function saveLead(leadData) {
  const db = getDb();
  await db.collection('leads').doc(leadData.leadId).set({
    ...leadData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Retrieve all leads, sorted by creation time descending.
 */
export async function getLeads() {
  const db      = getDb();
  const snap    = await db.collection('leads').orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    };
  });
}

/**
 * Update the status field of a lead.
 * @param {string} leadId
 * @param {string} status
 */
export async function updateLeadStatus(leadId, status) {
  const db = getDb();
  await db.collection('leads').doc(leadId).update({ status });
}
