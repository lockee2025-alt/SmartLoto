import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase.js";

async function login(username, password) {
  // Reference your "Users" collection (not lowercase 'users')
  const usersRef = collection(db, "Users");

  // Query by username and password
  const q = query(
    usersRef,
    where("username", "==", username),
    where("password", "==", password)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // If a user was found
    const userData = querySnapshot.docs[0].data();
    console.log("Login successful!");
    console.log("Full Name:", userData.fullName);
    console.log("Role:", userData.role);
    return userData;
  } else {
    console.log("Invalid username or password");
    return null;
  }
}

export { login };
