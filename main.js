// main.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

async function getUsers() {
  const output = document.getElementById("output");
  const querySnapshot = await getDocs(collection(db, "Test"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(`${doc.id} =>`, data);

    // Display results in the HTML
    const p = document.createElement("p");
    p.textContent = `${doc.id}: ${JSON.stringify(data)}`;
    output.appendChild(p);
  });
}

getUsers();
