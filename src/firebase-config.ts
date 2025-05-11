// This file will contain your Firebase configuration.
// You will add your specific project details here.

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDAf17DZtnFIa1w36KK9WWvRY7QyNO2ySk",
  authDomain: "opennotebook-7cb0a.firebaseapp.com",
  projectId: "opennotebook-7cb0a",
  storageBucket: "opennotebook-7cb0a.firebasestorage.app",
  messagingSenderId: "236722595389",
  appId: "1:236722595389:web:fa80947d8a949751b12c54",
  measurementId: "G-50CF1B70SV", // This might be optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };