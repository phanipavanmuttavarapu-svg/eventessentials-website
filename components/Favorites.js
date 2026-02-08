"use client";
import { useEffect, useState } from "react";

const FAVORITES_DB = "EventEssentials_Favorites";
const FAVORITES_STORE = "Favorites";

export const initFavoritesDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(FAVORITES_DB, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
        db.createObjectStore(FAVORITES_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addFavorite = async (item) => {
  const db = await initFavoritesDB();
  const id = `${item.category}-${item.title || item.src}`;
  const favorite = { id, ...item, timestamp: Date.now() };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FAVORITES_STORE, "readwrite");
    tx.objectStore(FAVORITES_STORE).put(favorite);
    tx.oncomplete = () => resolve(favorite);
    tx.onerror = () => reject(tx.error);
  });
};

export const removeFavorite = async (id) => {
  const db = await initFavoritesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FAVORITES_STORE, "readwrite");
    tx.objectStore(FAVORITES_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getAllFavorites = async () => {
  const db = await initFavoritesDB();
  return new Promise((resolve) => {
    const request = db.transaction(FAVORITES_STORE, "readonly").objectStore(FAVORITES_STORE).getAll();
    request.onsuccess = () => resolve(request.result || []);
  });
};

export const isFavorited = async (id) => {
  const db = await initFavoritesDB();
  return new Promise((resolve) => {
    const request = db.transaction(FAVORITES_STORE, "readonly").objectStore(FAVORITES_STORE).get(id);
    request.onsuccess = () => resolve(!!request.result);
  });
};

export function FavoriteButton({ id, category, title, link, src, className = "" }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    isFavorited(id).then(setIsFav);
  }, [id]);

  const toggleFavorite = async () => {
    if (isFav) {
      await removeFavorite(id);
    } else {
      await addFavorite({ id, category, title, link, src });
    }
    setIsFav(!isFav);
  };

  return (
    <button onClick={toggleFavorite} className={`text-xl transition-all ${isFav ? 'text-red-500 scale-110' : 'text-gray-300 hover:text-red-300'} ${className}`}>
      ❤️
    </button>
  );
}
