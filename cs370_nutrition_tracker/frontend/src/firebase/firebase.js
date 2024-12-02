import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMYsRRBoN5E152UvF4wcWIubn0ThRbDd0",
  authDomain: "practice-website-test-ab3ea.firebaseapp.com",
  projectId: "practice-website-test-ab3ea",
  storageBucket: "practice-website-test-ab3ea.firebasestorage.app",
  messagingSenderId: "117798442331",
  appId: "1:117798442331:web:f00f9ee864b6e3f9cc767e"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



export { app, auth };
