// locks.js
import { db, collection, query, where, onSnapshot } from "../firebase.js";

export function setupLocks(loggedInUser, el) {
  if (!loggedInUser.companyID) return;

  const countPendingRemarks = (locks) =>
    locks.reduce((acc, lock) => {
      const step = Number(lock.sequenceStep);
      const currentRole = lock.assignedRoles?.find(r => Number(r.sequence) === step);
      const hasRemark = lock.remarks?.some(r => Number(r.sequence) === step && r.role === currentRole?.roleID);
      return acc + (hasRemark ? 0 : 1);
    }, 0);

  const renderStats = (locks) => {
    const total = locks.length;
    const inProgress = locks.filter(l => Number(l.sequenceStep) <= (l.assignedRoles?.length || 0)).length;
    const completed = total - inProgress;
    const pending = countPendingRemarks(locks);

    el.totalLocks.textContent = total;
    el.locksInProgress.textContent = inProgress;
    el.locksCompleted.textContent = completed;
    el.pendingRemarks.textContent = pending;
  };

  const renderTransactions = (locks) => {
    el.lockTransactions.innerHTML = "";

    locks.slice(-5).reverse().forEach(l => {
      const totalSteps = l.assignedRoles?.length || 0;
      const computedStatus = Number(l.sequenceStep) === 0 || Number(l.sequenceStep) === totalSteps ? "Completed" : "In Progress";
      const realStatus = l.status ?? "Unknown";

      const div = document.createElement("div");
      div.className = "flex justify-between items-center border border-gray-200 rounded-lg p-3 shadow-sm";

      div.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 ${computedStatus === "Completed" ? "bg-green-500" : "bg-yellow-500"} rounded-full"></div>
          <div>
            <p class="font-medium">${realStatus}</p>
            <p class="text-xs text-gray-500">${l.name || "No Name"} - ${l.location || "No Location"}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="${computedStatus === "Completed" ? "bg-green-400" : "bg-yellow-400"} text-xs font-semibold px-2 py-1 rounded">
            ${computedStatus}
          </span>
        </div>
      `;

      el.lockTransactions.appendChild(div);
    });
  };

  const locksQuery = query(collection(db, "locks"), where("companyID", "==", loggedInUser.companyID));

  onSnapshot(locksQuery, (snapshot) => {
    const locks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    renderStats(locks);
    renderTransactions(locks);
  });
}
