// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8llGBdW5KHoVxOP71vdsipDnvDDD0tWQ",
  authDomain: "opunk-9c443.firebaseapp.com",
  projectId: "opunk-9c443",
  storageBucket: "opunk-9c443.appspot.com",
  messagingSenderId: "77845533494",
  appId: "1:77845533494:web:6310c96640a738ed5f1997",
  measurementId: "G-FBR33N94C5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
