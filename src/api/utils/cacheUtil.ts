// // import CryptoJS from 'crypto-js';

// // const IS_PRODUCTION = import.meta.env.MODE === 'production';
// // const SECRET_KEY = IS_PRODUCTION ? import.meta.env.VITE_SECRET_KEY : null;

// // /**
// //  * Encrypt data using AES encryption.
// //  */
// // const encrypt = (data: string): string => {
// //   if (!IS_PRODUCTION) return data; // Skip encryption in development
// //   if (!SECRET_KEY) {
// //     throw new Error(
// //       '[CacheUtils] Missing SECRET_KEY in production environment'
// //     );
// //   }
// //   return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
// // };

// // /**
// //  * Decrypt data using AES decryption.
// //  */
// // const decrypt = (cipher: string): string => {
// //   if (!IS_PRODUCTION) return cipher; // Skip decryption in development
// //   if (!SECRET_KEY) {
// //     throw new Error(
// //       '[CacheUtils] Missing SECRET_KEY in production environment'
// //     );
// //   }
// //   try {
// //     return CryptoJS.AES.decrypt(cipher, SECRET_KEY).toString(CryptoJS.enc.Utf8);
// //   } catch (error) {
// //     console.error('[CacheUtils] Decryption failed:', error);
// //     return '';
// //   }
// // };

// // /**
// //  * Retrieve cached data from localStorage with type safety.
// //  * @param key - Cache key.
// //  * @param duration - Cache validity duration in milliseconds.
// //  * @returns Parsed cached data or `null` if expired or invalid.
// //  */
// // export const getCachedData = <T>(key: string, duration: number): T | null => {
// //   const storageKey = IS_PRODUCTION ? CryptoJS.SHA256(key).toString() : key;
// //   const cached = localStorage.getItem(storageKey);
// //   if (!cached) return null;

// //   try {
// //     const decrypted = decrypt(cached);
// //     const { data, timestamp } = JSON.parse(decrypted) as {
// //       data: T;
// //       timestamp: number;
// //     };

// //     if (Date.now() - timestamp > duration) {
// //       console.warn(`[CacheUtils] Cache expired for key: ${key}`);
// //       localStorage.removeItem(storageKey);
// //       return null;
// //     }

// //     return data;
// //   } catch (error) {
// //     console.error('[CacheUtils] Failed to retrieve cached data:', error);
// //     localStorage.removeItem(storageKey);
// //     return null;
// //   }
// // };

// // /**
// //  * Store data in localStorage with a timestamp for expiration.
// //  * @param key - Cache key.
// //  * @param data - Data to be cached.
// //  */
// // export const setCachedData = <T>(key: string, data: T): void => {
// //   try {
// //     const storageKey = IS_PRODUCTION ? CryptoJS.SHA256(key).toString() : key;
// //     const cache = {
// //       data,
// //       timestamp: Date.now(),
// //     };

// //     const encrypted = encrypt(JSON.stringify(cache));
// //     localStorage.setItem(storageKey, encrypted);
// //     console.log(`[CacheUtils] Stored data for key: ${key}`);
// //   } catch (error) {
// //     console.error('[CacheUtils] Failed to store data in cache:', error);
// //   }
// // };
// import CryptoJS from 'crypto-js';

// const IS_PRODUCTION = import.meta.env.MODE === 'production';
// const SECRET_KEY = IS_PRODUCTION ? import.meta.env.VITE_SECRET_KEY : null;

// /**
//  * Encrypt data using AES encryption (only in production).
//  */
// const encrypt = (data: string): string => {
//   if (!IS_PRODUCTION) return data;
//   if (!SECRET_KEY)
//     throw new Error('[CacheUtils] SECRET_KEY missing in production');
//   return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
// };

// /**
//  * Decrypt data using AES decryption (only in production).
//  */
// const decrypt = (cipher: string): string => {
//   if (!IS_PRODUCTION) return cipher;
//   if (!SECRET_KEY)
//     throw new Error('[CacheUtils] SECRET_KEY missing in production');
//   try {
//     return CryptoJS.AES.decrypt(cipher, SECRET_KEY).toString(CryptoJS.enc.Utf8);
//   } catch (error) {
//     console.error('[CacheUtils] Decryption failed:', error);
//     return '';
//   }
// };

// /**
//  * Retrieve cached data from localStorage.
//  */
// export const getCachedData = <T>(key: string, duration: number): T | null => {
//   const storageKey = IS_PRODUCTION ? CryptoJS.SHA256(key).toString() : key;
//   const cached = localStorage.getItem(storageKey);
//   if (!cached) return null;

//   try {
//     const decrypted = decrypt(cached);
//     const { data, timestamp } = JSON.parse(decrypted) as {
//       data: T;
//       timestamp: number;
//     };

//     if (Date.now() - timestamp > duration) {
//       console.warn(`[CacheUtils] Cache expired for key: ${key}`);
//       localStorage.removeItem(storageKey);
//       return null;
//     }

//     return data;
//   } catch (error) {
//     console.error('[CacheUtils] Failed to retrieve cached data:', error);
//     localStorage.removeItem(storageKey);
//     return null;
//   }
// };

// /**
//  * Store data in localStorage with expiration.
//  */
// export const setCachedData = <T>(key: string, data: T): void => {
//   try {
//     const storageKey = IS_PRODUCTION ? CryptoJS.SHA256(key).toString() : key;
//     const cache = { data, timestamp: Date.now() };
//     const encrypted = encrypt(JSON.stringify(cache));
//     localStorage.setItem(storageKey, encrypted);
//   } catch (error) {
//     console.error('[CacheUtils] Failed to store data in cache:', error);
//   }
// };

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export const getCachedData = <T>(key: string): T | null => {
  const cachedSession = sessionStorage.getItem(key);
  if (cachedSession) return JSON.parse(cachedSession);

  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    sessionStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const setCachedData = <T>(key: string, data: T): void => {
  const cache = { data, timestamp: Date.now() };
  localStorage.setItem(key, JSON.stringify(cache));
  sessionStorage.setItem(key, JSON.stringify(data));
};

// import CryptoJS from 'crypto-js';

// const IS_PRODUCTION = import.meta.env.MODE === 'production';
// const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || null;
// console.log('Current Mode:', import.meta.env.MODE);
// console.log('SECRET_KEY:', SECRET_KEY ? '✔️ Exists' : '❌ MISSING');
// /**
//  * Encrypt data using AES encryption (only in production).
//  */
// const encrypt = (data: string): string => {
//   if (!IS_PRODUCTION) return data;
//   if (!SECRET_KEY) {
//     console.warn(
//       '[CacheUtils] SECRET_KEY missing in production. Skipping encryption.'
//     );
//     return data; // Store plain text if key is missing
//   }
//   return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
// };

// /**
//  * Decrypt data using AES decryption (only in production).
//  */
// const decrypt = (cipher: string): string | null => {
//   if (!IS_PRODUCTION) return cipher;
//   if (!SECRET_KEY) {
//     console.warn(
//       '[CacheUtils] SECRET_KEY missing in production. Returning null.'
//     );
//     return null;
//   }
//   try {
//     return CryptoJS.AES.decrypt(cipher, SECRET_KEY).toString(CryptoJS.enc.Utf8);
//   } catch (error) {
//     console.error('[CacheUtils] Decryption failed:', error);
//     return null;
//   }
// };

// /**
//  * Retrieve cached data from sessionStorage (fast reloads) or localStorage.
//  */
// export const getCachedData = <T>(key: string, duration: number): T | null => {
//   const storageKey = CryptoJS.SHA256(key).toString();

//   // ✅ Check sessionStorage first (fastest)
//   const cachedSession = sessionStorage.getItem(storageKey);
//   if (cachedSession) {
//     console.log(`[Cache] Loaded from sessionStorage: ${key}`);
//     return JSON.parse(cachedSession);
//   }

//   // ✅ Check localStorage if sessionStorage has no data
//   const cached = localStorage.getItem(storageKey);
//   if (!cached) return null;

//   try {
//     const decrypted = decrypt(cached);
//     if (!decrypted) throw new Error('Decryption returned null');

//     const { data, timestamp } = JSON.parse(decrypted) as {
//       data: T;
//       timestamp: number;
//     };

//     // ✅ If cache expired, remove it
//     if (Date.now() - timestamp > duration) {
//       console.warn(`[CacheUtils] Cache expired for key: ${key}`);
//       localStorage.removeItem(storageKey);
//       return null;
//     }

//     // ✅ Store in sessionStorage for faster access
//     sessionStorage.setItem(storageKey, JSON.stringify(data));

//     return data;
//   } catch (error) {
//     console.error('[CacheUtils] Failed to retrieve cached data:', error);
//     localStorage.removeItem(storageKey);
//     return null;
//   }
// };

// /**
//  * Store data in both sessionStorage and localStorage with expiration.
//  */
// export const setCachedData = <T>(key: string, data: T): void => {
//   try {
//     const storageKey = CryptoJS.SHA256(key).toString();
//     const cache = { data, timestamp: Date.now() };
//     const encrypted = encrypt(JSON.stringify(cache));

//     // ✅ Store in both sessionStorage & localStorage
//     localStorage.setItem(storageKey, encrypted);
//     sessionStorage.setItem(storageKey, JSON.stringify(data));
//   } catch (error) {
//     console.error('[CacheUtils] Failed to store data in cache:', error);
//   }
// };
