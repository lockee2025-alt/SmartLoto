// sidebar.js
export function setupSidebar(user) {
  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.onclick = () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
  };

  // Hide sidebar links for restricted roles
  const restrictedRoles = ["super_admin", "company_admin"];
  if (user.role == "super_admin" || user.role == "company_admin") {
  document.getElementById("navAccounts").classList.remove("hidden");
  document.getElementById("navCompanies").classList.remove("hidden");
  document.getElementById("navLocks").classList.remove("hidden");
  }
}
