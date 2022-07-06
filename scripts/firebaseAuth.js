import '../styles/connect.scss'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
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

// login function firebase auth
const loginEmailPassword = async () => {
    const loginEmail = txtEmail.value
    const loginPassword = txtPassword.value

    try {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    } catch (error) {
        console.log(`Une erreur c'est produite, HAHA t'es la reine des salope de l'authentification ${error}`)
        showLoginError(error)
    }
}
// create Account function firebase auth
const createAccount = async () => {
    const Email = txtEmail.value
    const Password = txtPassword.value
    try {
        await createUserWithEmailAndPassword(auth, Email, Password)
    }
    catch (error) {
        console.log(`Une erreur c'est produite, HAHA t'es la reine des salope de l'inscription ${error}`)
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

// tout est dans le nom, apprend à lire stp
const logout = async () => {
    await signOut(auth);
}

// EventListener html button
btnLogin.addEventListener("click", loginEmailPassword)
btnSignup.addEventListener("click", createAccount)
btnLogout.addEventListener("click", logout)

monitorAuthState();






