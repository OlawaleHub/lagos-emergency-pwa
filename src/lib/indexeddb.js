// src/lib/indexeddb.js
// Thin promise wrapper around IndexedDB for queueing offline emergency alerts.

const DB_NAME = "lagos-emergency-db";
const STORE = "alerts";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function reqToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueAlert(alert) {
  const db = await openDB();
  const store = tx(db, "readwrite");
  await reqToPromise(store.put(alert));
  db.close();
}

export async function getQueuedAlerts() {
  const db = await openDB();
  const store = tx(db, "readonly");
  const all = await reqToPromise(store.getAll());
  db.close();
  return all;
}

export async function deleteAlert(id) {
  const db = await openDB();
  const store = tx(db, "readwrite");
  await reqToPromise(store.delete(id));
  db.close();
}

export async function clearQueued() {
  const db = await openDB();
  const store = tx(db, "readwrite");
  await reqToPromise(store.clear());
  db.close();
}
