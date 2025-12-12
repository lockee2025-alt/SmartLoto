// mainSidebar.js
export function setupSidebar(user) {
  if (!user) return;

  // --- Logout ---
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }

  // --- Role-based access ---
  const restrictedRoles = ["super_admin", "company_admin"];
  const isAdmin = restrictedRoles.includes(user.role);

  // Only admins can see Accounts, Companies, Locks
  const hideIfNoAccess = (id) => {
    const el = document.getElementById(id);
    if (!isAdmin && el) el.style.display = "none";
  };

  hideIfNoAccess("navAccounts");
  hideIfNoAccess("navCompanies");
  hideIfNoAccess("navLocks");

  // --- Sidebar User Info ---
  const nameEl = document.getElementById("name");
  const positionEl = document.getElementById("position");

  if (nameEl) nameEl.textContent = user.fullName || "User";
  if (positionEl) positionEl.textContent = user.role || "";

  // --- Auto-highlight current menu item ---
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  document.querySelectorAll("aside nav a").forEach((link) => {
    const href = link.getAttribute("href").toLowerCase();
    if (currentPage === href) {
      link.classList.add("bg-red-600", "text-white");
    } else {
      link.classList.remove("bg-red-600", "text-white");
    }
  });

  // --- Sidebar collapse toggle ---
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");

  if (sidebar && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("w-64");
      sidebar.classList.toggle("w-20");

      document.querySelectorAll(".sidebar-text").forEach((el) => {
        el.classList.toggle("hidden");
      });
    });
  }
}
