import { useEffect, useState } from "react";

export function useIndexedDBFile(key: string) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Open DB safely
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("FileDB", 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files"); // ✅ Create store if missing
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Save file
  const saveFile = async (file: File) => {
    try {
      const db = await openDB();
      const tx = db.transaction("files", "readwrite");
      tx.objectStore("files").put(file, key);

      tx.oncomplete = () => {
        loadFile(); // refresh preview
      };
    } catch (err) {
      console.error("Error saving file:", err);
    }
  };

  // Load file
  const loadFile = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction("files", "readonly");
      const getReq = tx.objectStore("files").get(key);

      getReq.onsuccess = () => {
        const file = getReq.result as Blob | undefined;
        if (file) {
          setFileUrl(URL.createObjectURL(file));
        }
      };
    } catch (err) {
      console.error("Error loading file:", err);
    }
  };

  // Remove file
  const removeFile = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction("files", "readwrite");
      tx.objectStore("files").delete(key);
    } catch (err) {
      console.error("Error removing file:", err);
    }
  };

  // Load once on mount
  useEffect(() => {
    loadFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { fileUrl, saveFile, loadFile, removeFile };
}
