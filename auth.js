// FIREBASE IMPORTS
import { auth } from "./firebase.js";

import {

    signInWithEmailAndPassword,
    createUserWithEmailAndPassword

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";




// ============================
// GET ELEMENTS
// ============================

// BOXES
const signinBox = document.getElementById("signinBox");

const signupBox = document.getElementById("signupBox");


// SWITCH TEXTS
const showSignup = document.getElementById("showSignup");

const showLogin = document.getElementById("showLogin");




// LOGIN ELEMENTS
const loginForm = document.getElementById("loginForm");

const loginEmail = document.getElementById("loginEmail");

const loginPassword = document.getElementById("loginPassword");

const loginBtn = document.getElementById("loginBtn");




// SIGNUP ELEMENTS
const signupForm = document.getElementById("signupForm");

const signupEmail = document.getElementById("signupEmail");

const signupPassword = document.getElementById("signupPassword");

const signupBtn = document.getElementById("signupBtn");




// ============================
// SHOW SIGNUP
// ============================
showSignup.addEventListener("click", () => {

    signinBox.style.display = "none";

    signupBox.style.display = "block";

});




// ============================
// SHOW LOGIN
// ============================
showLogin.addEventListener("click", () => {

    signupBox.style.display = "none";

    signinBox.style.display = "block";

});




// ============================
// LOGIN USER
// ============================
loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = loginEmail.value.trim();

    const password = loginPassword.value.trim();



    if(email === "" || password === ""){

        alert("Please fill all fields");

        return;
    }



    loginBtn.innerHTML = "Signing In...";



    signInWithEmailAndPassword(
        auth,
        email,
        password
    )

    .then((userCredential) => {

        alert("Login Successful");

        console.log(userCredential.user);

        window.location.href = "./dashboard.html";

    })

    .catch((error) => {

        alert(error.message);

    })

    .finally(() => {

        loginBtn.innerHTML = "SIGN IN";

    });

});




// ============================
// CREATE ACCOUNT
// ============================
signupForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = signupEmail.value.trim();

    const password = signupPassword.value.trim();




    if(email === "" || password === ""){

        alert("Please fill all fields");

        return;
    }




    signupBtn.innerHTML = "Creating...";



    createUserWithEmailAndPassword(
        auth,
        email,
        password
    )

    .then((userCredential) => {

        alert("Account Created Successfully");

        console.log(userCredential.user);



        // SWITCH BACK TO LOGIN
        signupBox.style.display = "none";

        signinBox.style.display = "block";



        // CLEAR INPUTS
        signupEmail.value = "";

        signupPassword.value = "";

    })

    .catch((error) => {

        alert(error.message);

    })

    .finally(() => {

        signupBtn.innerHTML = "CONTINUE";

    });

});