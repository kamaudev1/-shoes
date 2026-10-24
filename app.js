// app.js
const SUPABASE_URL = "https://ragcmdottawgtqspwfdw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XKOVxJYfqPtOdhUNLbtyaQ_eE3JF4Vx";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// This function runs automatically when the page loads
async function initApp() {
    // 1. Check Auth
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error || !session) { 
        window.location.href = "login.html"; 
        return null; 
    }

    // 2. Extract User Data
    const user = session.user;
    const metadata = user.user_metadata || {};
    const fullName = metadata.full_name || "User";
    const role = metadata.role || "sales";

    // 3. Update Sidebar UI
    const userNameEl = document.getElementById("user-name");
    const userRoleEl = document.getElementById("user-role");
    const userInitialEl = document.getElementById("user-initial");
    
    if (userNameEl) userNameEl.textContent = fullName;
    if (userRoleEl) userRoleEl.textContent = role;
    if (userInitialEl) userInitialEl.textContent = fullName.charAt(0).toUpperCase();

    // 4. Role-Based UI Toggles (Hide Owner stuff from Sales)
    if (role === 'owner') {
        document.querySelectorAll('.owner-only').forEach(el => el.style.display = 'flex');
    } else {
        document.querySelectorAll('.owner-only').forEach(el => el.style.display = 'none');
    }

    // 5. Setup Mobile Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    }

    // 6. Setup Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await supabaseClient.auth.signOut();
            window.location.href = "login.html";
        });
    }

    return { user, role, fullName };
}

// Run it immediately
initApp();