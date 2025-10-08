import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfiguration = {
  apiKey: "AIzaSyDhOk5AzkVZ3YK715Bv-HioV3brS9Ou30w",
  authDomain: "shop-db-242ac.firebaseapp.com",
  projectId: "shop-db-242ac",
  storageBucket: "shop-db-242ac.firebasestorage.app",
  messagingSenderId: "784698212651",
  appId: "1:784698212651:web:652808f4c49c3b3fa0056e",
  measurementId: "G-F8Y30H891Q"
};


const app=initializeApp(firebaseConfiguration);

export const auth= getAuth(app);
export const database=getFirestore(app);
export const storage= getStorage(app);