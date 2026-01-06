import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Cache to avoid refetching user & lock names
const userCache = {};
const lockCache = {};

async function getUserName(id) {
  if (!id) return "Unknown User";

  if (userCache[id]) return userCache[id];

  // If ID looks like a full Firestore document ID
  if (id.length > 10) {
    const snap = await getDoc(doc(db, "users", id));
    userCache[id] = snap.exists() ? snap.data().fullName : "Unknown User";
    return userCache[id];
  }

  // If short string like username
  return id;
}

async function getLockName(id) {
  if (!id) return "Unknown Lock";

  if (lockCache[id]) return lockCache[id];

  const snap = await getDoc(doc(db, "locks", id));
  lockCache[id] = snap.exists() ? snap.data().name : "Unknown Lock";
  return lockCache[id];
}

export function loadNotifications(user) {
  const container = document.getElementById("notificationsContainer");
  if (!user || !container) return;

  const logsRef = collection(db, "logs");
  const q = query(
    logsRef,
    where("companyID", "==", user.companyID),
    orderBy("timestamp", "desc")
  );

  onSnapshot(q, async (snapshot) => {
    container.innerHTML = "";

    if (snapshot.empty) {
      container.innerHTML = `<p class="text-gray-500 text-center">No activity yet.</p>`;
      return;
    }

    const fragment = document.createDocumentFragment();

for (const docSnap of snapshot.docs) {
  const log = docSnap.data();

  const userName = await getUserName(log.userID);
  const lockName = await getLockName(log.lockID);

  const timestamp = log.timestamp?.toDate
    ? log.timestamp.toDate()
    : new Date(log.timestamp);

  const formattedTime = timestamp.toLocaleString("en-PH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const actionColor =
    log.action === "unlock"
      ? "bg-green-100 text-green-800"
      : log.action === "lock"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-700";

  const wrapper = document.createElement("div");
  wrapper.className =
    "bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm animate-fadeIn";

  wrapper.innerHTML = `
    <div>
      <p class="text-gray-800 font-medium">${userName}</p>
      <p class="text-gray-600 text-sm">
        performed <span class="font-semibold">${log.action}</span> on 
        <span class="font-semibold">${lockName}</span>
      </p>
      <p class="text-xs text-gray-400 mt-1">${formattedTime}</p>
    </div>
    <span class="text-xs ${actionColor} px-3 py-1 rounded-full capitalize">
      ${log.result || "N/A"}
    </span>
  `;

  fragment.appendChild(wrapper);
}
container.appendChild(fragment);
  });
}
