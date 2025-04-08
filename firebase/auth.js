import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    createUserWithEmailAndPassword, 
    getAuth, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

//Initialize app
const firebaseConfig = {
    apiKey: "<<YOUR API KEY>>",
    authDomain: "<>",
    projectId: "<>",
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup Function
const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        admin: false  //change the user permission
    });
    console.log("User signed up:", user);
  } catch (error) {
    console.error("Signup Error:", error.message);
  }
};

// Login Function
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    //get data from firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User logged in:", user);

        if(userData.admin) {
            console.log("Admin logged in");
            window.location.href = "admin-dashboard.html"; // Redirect correctly
        } else {
            console.log("Normal user logged in");
            window.location.href = "../home.html"; //Redirect to normal home page
        }
    } else {
        console.error("User data not found in firestore");
    }
  } catch (error) {
    console.error("Login Error:", error.message);
  }
};

// Logout Function
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
    window.location.href = "/login.html";
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

//check user Role on page load
const checkUserRole = async () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();

                if(userData.admin) {
                    console.log("Admin detected");
                    window.location.href = "admin-dashboard.html"; 
                } else {
                    console.log("Regular user detected");
                    document.getElementById("admin-section").style.display = "none"; // Hide admin panel  
                }
            }
        }
    });
};

// Export functions to use in other files
export { app, auth, db, signUp, login, logout, checkUserRole };
