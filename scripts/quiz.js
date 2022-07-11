import '../styles/reset.css'
import '../styles/global.scss'
import '../styles/quiz.scss'
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, query, where, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebaseConfig";

