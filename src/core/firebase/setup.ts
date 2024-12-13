import { FirebaseApp, initializeApp } from "firebase/app";
import {
  FirebaseStorage,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Analytics, getAnalytics, logEvent } from "firebase/analytics";
// import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';
import {
  Firestore,
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  query,
  where,
  getDocs,
  QuerySnapshot,
  DocumentData,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
  onAuthStateChanged,
  User,
  signOut,
} from "firebase/auth";
import { CONFIG } from "src/config";

const FIREBASE_CONFIG_PROD = {
  apiKey: "AIzaSyDfDSxBZ8goNR-UooP6VlDKNSTS7Z2m-Bw",
  authDomain: "buzbridge-3200f.firebaseapp.com",
  projectId: "buzbridge-3200f",
  storageBucket: "buzbridge-3200f.appspot.com",
  messagingSenderId: "181224636864",
  appId: "1:181224636864:web:b499f86d45cf5809314825",
  measurementId: "G-60JNCZE7V4",
};

const FIREBASE_CONFIG_DEV = {
  apiKey: "AIzaSyCo1g9UzsYKk3TNxUDg3JGFiD9jdmwRac0",
  authDomain: "buzbridge-41dde.firebaseapp.com",
  projectId: "buzbridge-41dde",
  storageBucket: "buzbridge-41dde.appspot.com",
  messagingSenderId: "314597116560",
  appId: "1:314597116560:web:5102eac4f0274eda696615",
};

const firebaseConfig = CONFIG.isDevelopment
  ? FIREBASE_CONFIG_DEV
  : FIREBASE_CONFIG_PROD;

// Get a list of cities from your database
// async function getCities(db) {
//   const citiesCol = collection(db, "cities");
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map((doc) => doc.data());
//   return cityList;
// }

// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed up
//     const user = userCredential.user;
//     // ...
//     console.log(">>>> ", user);
//   })
//   .catch((error) => {
//     console.log(">>>>error ", error);
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });

export enum FIRESTORE_DB {
  /** @deprecated */
  BRANDS = "brands",
  /** @deprecated */
  CREATORS = "creators",
  /** @deprecated */
  INSTAGRAM_PROFILE = "instagram_profiles",

  USERS = "users",
  LINKS = "links",
  PRODUCTS = "products",
}

class Firebase {
  app: FirebaseApp | null = null;
  analytics: Analytics | null = null;
  db: Firestore | null = null;
  auth: Auth | null = null;
  initilized: boolean = false;
  storage: FirebaseStorage | null = null;

  init = async (onAuthChanged: (user: User | null) => void) => {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.storage = getStorage(this.app);

    onAuthStateChanged(this.auth, onAuthChanged);
    await this.auth.authStateReady();
    return this.auth.currentUser;
  };

  logEvent = (eventName: string) => {
    if (!this.analytics) return;

    logEvent(this.analytics, eventName);
  };

  createAccount = async (email: string, password: string) => {
    if (!this.auth) return null;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Signed up
      const user = userCredential.user;
      // ...
      return user;
    } catch (error: any) {
      // const errorCode = error.code;
      const errorMessage = error?.message;
      throw new Error(errorMessage);
    }
  };

  signInEmail = async (email: string, password: string) => {
    if (!this.auth) return null;

    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const user = userCredential.user;
      // ...
      return user ?? null;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw new Error(errorMessage);
    }
  };

  signOut = async () => {
    try {
      if (!this.auth) return null;

      await signOut(this.auth);
      return true;
    } catch (error) {
      return null;
    }
  };

  setDocument = async (db_name: FIRESTORE_DB, id: string, data?: any) => {
    if (!this.db) return null;

    try {
      await setDoc(doc(this.db, db_name, id), data, { merge: true });
    } catch (e) {
      console.error("Error adding document: ", e);
      return null;
    }
  };

  addDocument = async (db_name: FIRESTORE_DB, data?: any) => {
    if (!this.db) return null;

    try {
      await addDoc(collection(this.db, db_name), data);
    } catch (e) {
      console.error("Error adding document: ", e);
      return null;
    }
  };

  updateDocument = async (db_name: FIRESTORE_DB, id: string, data?: any) => {
    if (!this.db) return null;

    try {
      await updateDoc(doc(this.db, db_name, id), data);
    } catch (e) {
      console.error("Error adding document: ", e);
      return null;
    }
  };

  getDocument = async (db_name: FIRESTORE_DB, id?: string | null) => {
    if (!this.db || !id) return null;

    try {
      const docRef = doc(this.db, db_name, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        return null;
      }
    } catch (err) {
      console.log(">>>>>err", err);

      return null;
    }
  };

  deleteDocument = async (db_name: FIRESTORE_DB, id?: string | null) => {
    if (!this.db || !id) return null;

    try {
      const docRef = doc(this.db, db_name, id);
      await deleteDoc(docRef);

      return null;
    } catch (err) {
      return null;
    }
  };

  queryKey = async (
    db_name: FIRESTORE_DB,
    key: string,
    value: string
  ): Promise<QuerySnapshot<DocumentData, DocumentData> | null> => {
    if (!this.db || !key || !value) return null;

    try {
      const collectionRef = collection(this.db, db_name);
      const q = query(collectionRef, where(key, "==", value));

      const querySnapshot = await getDocs(q);
      return querySnapshot;
    } catch (err) {
      return null;
    }
  };

  upload = async (file: any, _path: string) => {
    if (!this.storage) return null;

    try {
      const storageRef = ref(this.storage, _path);

      // 'file' comes from the Blob or File API
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Uploaded a blob or file!", snapshot);
      // const downloadUrl = await fb.getDownloadUrl(_path);
      // return downloadUrl;
      return _path;
    } catch (err) {
      return null;
    }
  };

  deleteFile = async (_path: string) => {
    if (!this.storage) return;

    try {
      const storageRef = ref(this.storage, _path);

      // 'file' comes from the Blob or File API
      await deleteObject(storageRef);

      return true;
    } catch (err) {
      return null;
    }
  };

  getDownloadUrl = async (_path?: string) => {
    if (!this.storage || !_path) return;

    try {
      const url = await getDownloadURL(ref(this.storage, _path));

      // `url` is the download URL for 'images/stars.jpg'

      // This can be downloaded directly:
      // const xhr = new XMLHttpRequest();
      // xhr.responseType = "blob";
      // xhr.onload = (event) => {
      //   const blob = xhr.response;
      // };
      // xhr.open("GET", url);
      // xhr.send();

      // Or inserted into an <img> element
      // const img = document.getElementById("myimg");
      // img.setAttribute("src", url);
      return url;
    } catch (err) {}
  };
}

export const fb = new Firebase();
