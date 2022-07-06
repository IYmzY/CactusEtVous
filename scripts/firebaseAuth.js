import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, AuthErrorCodes } from "firebase/auth";
import { app } from "./firebaseConfig"


// Authentification 
const auth = getAuth(app)

const txtEmail = document.querySelector('#txtEmail')
const txtPassword = document.querySelector('#txtPassword')

const btnLogin = document.querySelector('#btnLogin')
const btnSignup = document.querySelector('#btnSignup')

const btnLogout = document.querySelector('#btnLogout')

const divAuthState = document.querySelector('#divAuthState')
const lblAuthState = document.querySelector('#lblAuthState')

const divLoginError = document.querySelector('#divLoginError')
const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage')

export const showLoginForm = () => {
    login.style.display = 'block'
    app.style.display = 'none'
}

export const showApp = () => {
    login.style.display = 'none'
    app.style.display = 'block'
}

export const hideLoginError = () => {
    divLoginError.style.display = 'none'
    lblLoginErrorMessage.innerHTML = ''
}

export const showLoginError = (error) => {
    divLoginError.style.display = 'block'
    if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
        lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`
    }
    else {
        lblLoginErrorMessage.innerHTML = `Error: ${error.message}`
    }
}

export const showLoginState = (user) => {
    lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
}
hideLoginError()

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
        await createUserWithEmailAndPassword(auth, loginEmail, loginPassword)
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
            hideLinkError()
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
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });
// signOut(auth).then(() => {
//   // Sign-out successful.
// }).catch((error) => {
//   // An error happened.
// });



