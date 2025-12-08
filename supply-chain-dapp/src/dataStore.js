// src/dataStore.js

const USERS_KEY = "sc_users_v1";
const PRODUCTS_KEY = "sc_products_v1";

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

const defaultUsers = [
  {
    id: "u-admin",
    username: "admin",
    password: "admin",
    role: "admin",
    ethAddress: "",
    privateKey: ""
  }
];

export function loadUsers() {
  const storage = getStorage();
  if (!storage) return defaultUsers;

  try {
    const raw = storage.getItem(USERS_KEY);
    if (!raw) return defaultUsers;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return defaultUsers;
  } catch {
    return defaultUsers;
  }
}

export function saveUsers(users) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function loadProducts() {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(PRODUCTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export function saveProducts(products) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch {
    // ignore
  }
}
