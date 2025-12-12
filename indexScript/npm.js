// npm.js
import { db, collection, query, where, onSnapshot } from "../firebase.js";
import { orderBy, limit, deleteDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

export function setupNpm(loggedInUser, el) {
  if (!loggedInUser.companyID) return;

  let currentNpmRef = null;

  const formatDate = (raw) => {
    if (!raw) return "N/A";
    const d = raw.toDate ? raw.toDate() : new Date(raw);
    return d.toLocaleDateString();
  };

  const npmQuery = query(
    collection(db, "npm"),
    where("companyId", "==", loggedInUser.companyID),
    orderBy("date", "asc"),
    limit(1)
  );

  onSnapshot(npmQuery, async (snap) => {
    if (snap.empty) {
      el.nextNpm.textContent = "N/A";
      currentNpmRef = null;
      return;
    }

    const docSnap = snap.docs[0];
    const data = docSnap.data();
    currentNpmRef = docSnap.ref;

    const date = data.date?.toDate ? data.date.toDate() : new Date(data.date);

    if (new Date() > date) {
      await deleteDoc(currentNpmRef);
      el.nextNpm.textContent = "N/A";
      currentNpmRef = null;
      return;
    }

    el.nextNpm.textContent = formatDate(data.date);
  });

  // Manual delete button
  el.nextNpmBtn.onclick = async () => {
    if (!currentNpmRef) return alert("No NPM to delete!");
    await deleteDoc(currentNpmRef);
    el.nextNpm.textContent = "N/A";
    currentNpmRef = null;
    alert("NPM deleted!");
  };
}
