// main.js
import { setupSidebar } from "../mainScript/sidebar.js";
import { setupNpm } from "./npm.js";
import { setupLocks } from "./locks.js";

// DOM Cache
const el = {
  name: document.getElementById("name"),
  secondName: document.getElementById("secondName"),
  position: document.getElementById("position"),
  logoutBtn: document.getElementById("logoutBtn"),

  totalLocks: document.getElementById("totalLocks"),
  locksInProgress: document.getElementById("locksInProgress"),
  locksCompleted: document.getElementById("locksCompleted"),
  pendingRemarks: document.getElementById("pendingRemarks"),

  lockTransactions: document.querySelector(".lock-transactions"),
  nextNpm: document.getElementById("nextNpm"),
  nextNpmBtn: document.getElementById("nextNpmBtn")
};

// User check
const loggedInUser = JSON.parse(localStorage.getItem("user"));
if (!loggedInUser) window.location.href = "index.html";

// Fill topbar/sidebar
el.name.textContent = loggedInUser.fullName ?? "N/A";
el.secondName.textContent = loggedInUser.fullName ?? "N/A";
el.position.textContent = loggedInUser.role ?? "N/A";

// Initialize modules
setupSidebar(loggedInUser);
setupNpm(loggedInUser, el);
setupLocks(loggedInUser, el);
