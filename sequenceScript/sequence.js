import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

export function initSequenceTable(loggedInUser) {
  if (!loggedInUser?.companyID) return;

  const tableBody = document.querySelector("tbody");
  const remarkModal = document.getElementById("remarkModal");
  const remarkForm = document.getElementById("remarkForm");
  const closeRemarkModal = document.getElementById("closeRemarkModal");

  closeRemarkModal.addEventListener("click", () => remarkModal.classList.add("hidden"));

  remarkForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const note = remarkForm.note.value.trim();
    const lockID = remarkForm.lockID.value;
    const role = remarkForm.role.value;
    const sequence = remarkForm.dataset.sequence;
    if (!note || !lockID || !role) return;

    const lockRef = doc(db, "locks", lockID);
    await updateDoc(lockRef, {
      remarks: arrayUnion({
        role,
        note,
        authorName: loggedInUser.fullName || loggedInUser.username,
        sequence: Number(sequence),
        timestamp: new Date().toISOString()
      }),
    });

    remarkForm.reset();
    remarkModal.classList.add("hidden");
  });

  const locksQuery = query(
    collection(db, "locks"),
    where("companyID", "==", loggedInUser.companyID)
  );

  onSnapshot(locksQuery, snapshot => {
    tableBody.innerHTML = "";
    const fragment = document.createDocumentFragment();

    snapshot.docs.forEach(docSnap => {
      const lock = docSnap.data();
      const assignedRoles = (lock.assignedRoles || []).sort((a, b) => a.sequence - b.sequence);
      const sequenceStep = lock.sequenceStep || 1;

      // Lock Header
      const headerRow = document.createElement("tr");
      headerRow.innerHTML = `<td colspan="5" class="bg-gray-200 text-gray-800 font-semibold text-center py-2">
        ${lock.name} — ${lock.location || "No Location"}
      </td>`;
      fragment.appendChild(headerRow);

      assignedRoles.forEach((roleObj, index) => {
        const tr = document.createElement("tr");
        tr.className = "border-b hover:bg-gray-50";

        let status = "Pending";
        let statusClass = "bg-gray-100 text-gray-600";
        let nextStep = "";

        if (roleObj.sequence < sequenceStep) {
          status = "Done"; statusClass = "bg-green-100 text-green-800";
          nextStep = assignedRoles[index + 1] ? `${assignedRoles[index+1].roleID} can proceed` : "All steps completed";
        } else if (roleObj.sequence === sequenceStep) {
          status = "In Progress"; statusClass = "bg-yellow-100 text-yellow-800";
          nextStep = assignedRoles[index + 1] ? `Waiting for ${assignedRoles[index+1].roleID}` : "Final step in progress";
        } else {
          status = "Pending"; statusClass = "bg-gray-100 text-gray-600";
          nextStep = `Waiting for ${assignedRoles.find(r => r.sequence === sequenceStep)?.roleID || "previous role"}`;
        }

        const canAddRemark = roleObj.sequence === sequenceStep && loggedInUser.role === roleObj.roleID;

        const roleRemarks = (lock.remarks || [])
          .filter(r => r.role === roleObj.roleID && Number(r.sequence) === Number(roleObj.sequence))
          .map(r => `- ${r.note} (${r.authorName || "Unknown"}, ${new Date(r.timestamp).toLocaleString()})`)
          .join("\n") || "-";

        tr.innerHTML = `
          <td class="border px-4 py-2 text-center font-semibold">Step ${roleObj.sequence}</td>
          <td class="border px-4 py-2">${roleObj.roleID}</td>
          <td class="border px-4 py-2"><span class="${statusClass} px-2 py-1 rounded">${status}</span></td>
          <td class="border px-4 py-2 text-gray-500">${nextStep}</td>
          <td class="border px-4 py-2 whitespace-pre-wrap">
            ${roleRemarks}
            ${canAddRemark ? `<button class="ml-2 bg-blue-500 text-white px-2 py-1 rounded remark-btn" 
            data-lock="${docSnap.id}" data-role="${roleObj.roleID}" data-sequence="${roleObj.sequence}">Add</button>` : ""}
          </td>
        `;
        fragment.appendChild(tr);
      });

      // Divider
      const divider = document.createElement("tr");
      divider.innerHTML = `<td colspan="5" class="py-1 bg-white"></td>`;
      fragment.appendChild(divider);
    });

    tableBody.appendChild(fragment);

    // Attach remark buttons
    document.querySelectorAll(".remark-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        remarkForm.lockID.value = e.target.dataset.lock;
        remarkForm.role.value = e.target.dataset.role;
        remarkForm.dataset.sequence = e.target.dataset.sequence;
        remarkModal.classList.remove("hidden");
      });
    });
  });
}
