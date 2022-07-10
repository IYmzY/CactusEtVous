import '../styles/reset.css'
import '../styles/global.scss'
import '../styles/connect.scss'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
    hideLoginError,
    showLoginState,
    showLoginForm,
    showApp,
    showLoginError,
    btnLogin,
    btnSignup,
    btnLogout
} from './handleAuthError'
import { app } from "./firebaseConfig"


// Authentification 
const auth = getAuth(app)
const db = getFirestore(app);

// login function firebase auth
const loginEmailPassword = async () => {
    const loginEmail = txtEmail.value
    const loginPassword = txtPassword.value

    try {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    } catch (error) {
        console.log(`Une erreur s'est produite lors de ta tentive de connexion : ${error}`)
        showLoginError(error)
    }
}
// create Account function firebase auth & add user to db collection
const createAccount = async () => {
    const Email = txtEmailSignUp.value
    const Password = txtPasswordSignUp.value

    try {
        createUserWithEmailAndPassword(auth, Email, Password)
            .then(userCredential => {
                const userID = userCredential.user.uid;
                try {
                    addUserToDB(userID);
                }
                catch (error) {
                    console.log(`Une erreur s'est produite lors de ta tentive d'inscription :${error}`)
                }

            })
    }
    catch (error) {
        console.log(`Une erreur s'est produite lors de ta tentive d'inscription :${error}`)
    }
}

// show if user is connected or not
const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            console.log(user)
            showApp()
            showLoginState(user)
           hideLoginError()
        }
        else {
            showLoginForm()
            lblAuthState.innerHTML = `You're not logged in.`
        }
    })
}

// add user to DB
const addUserToDB = async (userID) => {
    const FirstName = txtFirstName.value
    const LastName = txtLastName.value
    const PhoneNumber = txtPhoneNumber.value
    await setDoc(doc(db, "users", userID), {
        firstName: FirstName,
        lastName: LastName,
        phoneNumber: PhoneNumber,
        admin: false
    });
}

// tout est dans le nom, apprend à lire stp
const logout = async () => {
    await signOut(auth);
}

// EventListener html button
btnLogin.addEventListener("click", loginEmailPassword)
btnSignup.addEventListener("click", createAccount)
btnLogout.addEventListener("click", logout)

monitorAuthState();






