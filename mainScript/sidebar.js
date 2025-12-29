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

  const toggleButton = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");
    const textElements = document.querySelectorAll(".sidebar-text");
    const dashboard = document.getElementById("dashboard");
  
    // Collapse sidebar by default on mobile
    if (window.innerWidth < 1024) {
      sidebar.classList.remove("w-64");
      sidebar.classList.add("w-14");
      textElements.forEach(el => el.classList.add("hidden"));
    }
  
    toggleButton.addEventListener("click", () => {
      if (window.innerWidth < 1024) {
        // MOBILE: toggle full-screen sidebar
        sidebar.classList.toggle("fixed");
        sidebar.classList.toggle("inset-0");
        sidebar.classList.toggle("!w-full");
        sidebar.classList.toggle("z-50");
        dashboard.classList.toggle("hidden");
  
        // toggle text visibility
        textElements.forEach(el => {
          el.classList.toggle("hidden");
        });
      } else {
        // DESKTOP: toggle between wide and collapsed
        sidebar.classList.toggle("w-64");
        sidebar.classList.toggle("w-14");
        textElements.forEach(el => {
          el.classList.toggle("hidden");
        });
      }
    });
}
