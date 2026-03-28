/* ==========================================================
   iCode Coffee Shop Website - Frontend Logic
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  
  // ==========================================
  // 1. ORDER PAGE LOGIC (order.html)
  // ==========================================
  const orderForm = document.getElementById("orderForm");
  const qtyInput = document.getElementById("qty");
  const sizeSelect = document.getElementById("size");
  const totalPreview = document.getElementById("totalPreview");
  
  function getPrice(size) {
    if (size === "Small") return 3.00;
    if (size === "Medium") return 4.00;
    if (size === "Large") return 5.00;
    return 0;
  }

  function updatePreview() {
    if (!qtyInput || !sizeSelect || !totalPreview) return;
    const qty = parseInt(qtyInput.value) || 1;
    const size = sizeSelect.value;
    const price = getPrice(size);
    const total = price * qty;
    if (price > 0) {
      totalPreview.textContent = `Live Total Preview: $${total.toFixed(2)}`;
    } else {
      totalPreview.textContent = "Live Total Preview: Choose a size first";
    }
  }

  if (qtyInput && sizeSelect && totalPreview) {
    qtyInput.addEventListener("input", updatePreview);
    sizeSelect.addEventListener("change", updatePreview);
    updatePreview();
  }

  if (orderForm) {
    orderForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const name = document.getElementById("orderName").value.trim();
      const drink = document.getElementById("orderDrink").value.trim();
      const size = document.getElementById("size").value;
      const qty = parseInt(document.getElementById("qty").value) || 1;
      const isIced = document.getElementById("iced").checked;
      const icodeId = document.getElementById("icodeId") ? document.getElementById("icodeId").value.trim() : "";
      const errorDiv = document.getElementById("orderError");
      const receiptCard = document.getElementById("receiptCard");

      if (!name || !drink || !size) {
        errorDiv.style.display = "block";
        receiptCard.style.display = "none";
        return;
      }
      
      errorDiv.style.display = "none";
      const price = getPrice(size);
      let total = price * qty;
      let isDiscounted = false;

      // Apply 20% discount if an iCode ID is provided
      if (icodeId.length > 0) {
        total = total * 0.8;
        isDiscounted = true;
      }

      document.getElementById("rName").textContent = name;
      document.getElementById("rDrink").textContent = drink;
      document.getElementById("rSize").textContent = size;
      document.getElementById("rIced").textContent = isIced ? "Iced" : "Hot";
      document.getElementById("rQty").textContent = qty;
      document.getElementById("rPrice").textContent = price.toFixed(2);
      
      const totalCol = document.getElementById("rTotal");
      if (isDiscounted) {
        totalCol.innerHTML = `${total.toFixed(2)} <span style="color:var(--color-accent); font-size:14px; display:block;">(20% iCode Member Discount Applied)</span>`;
      } else {
        totalCol.textContent = total.toFixed(2);
      }
      
      receiptCard.style.display = "block";
      
      // Smooth scroll to receipt
      receiptCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // ==========================================
  // 2. CUSTOMERS PAGE LOGIC (customers.html)
  // ==========================================
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const tableBody = document.getElementById("customerTableBody");
  const filterLabel = document.getElementById("filterLabel");

  const customers = [
    { id: 1, name: "Mia Lopez", favorite: "Latte" },
    { id: 2, name: "Ethan Kim", favorite: "Americano" },
    { id: 3, name: "Ava Patel", favorite: "Hot Chocolate" },
    { id: 4, name: "Noah Chen", favorite: "Mocha" },
    { id: 5, name: "Sofia Brown", favorite: "Cappuccino" },
    { id: 6, name: "Lucas Green", favorite: "Iced Coffee" }
  ];

  function renderCustomers(query = "") {
    if (!tableBody) return;
    
    tableBody.innerHTML = "";
    const lowerQuery = query.toLowerCase();
    
    const filtered = customers.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.favorite.toLowerCase().includes(lowerQuery)
    );
    
    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 40px; color: var(--color-text-muted);">No customers matched your search criteria.</td></tr>`;
      return;
    }
    
    filtered.forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span style="background: rgba(26, 18, 11, 0.08); padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 13px;">#${c.id}</span></td>
        <td style="font-weight: 600;">${c.name}</td>
        <td style="color: var(--color-text-muted);">${c.favorite}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  if (tableBody) {
    // Initial render
    renderCustomers();
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const val = searchInput.value.trim();
      filterLabel.textContent = val ? `"${val}"` : "All customers";
      renderCustomers(val);
    });
  }

  // ==========================================
  // 3. AUTHENTICATION LOGIC (login.html & staff.html)
  // ==========================================
  const loginForm = document.getElementById("loginForm");
  const authGuard = document.getElementById("authGuard");
  const staffContent = document.getElementById("staffContent");
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutBtnMain = document.getElementById("logoutBtnMain");

  if (loginForm) {
    // If already logged in, redirect to staff.html
    if (sessionStorage.getItem("staffLoggedIn") === "true") {
      window.location.href = "staff.html";
    }

    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const user = document.getElementById("username").value.trim();
      const pass = document.getElementById("password").value.trim();
      const err = document.getElementById("loginError");

      if (user === "barista" && pass === "coffee123") {
        sessionStorage.setItem("staffLoggedIn", "true");
        sessionStorage.setItem("staffName", user);
        window.location.href = "staff.html";
      } else {
        err.style.display = "block";
      }
    });
  }

  // Check auth on staff page
  if (authGuard && staffContent) {
    if (sessionStorage.getItem("staffLoggedIn") === "true") {
      authGuard.style.display = "none";
      staffContent.style.display = "block";
      const nameDisp = document.getElementById("staffNameDisplay");
      if(nameDisp) nameDisp.textContent = sessionStorage.getItem("staffName");
    } else {
      authGuard.style.display = "block";
      staffContent.style.display = "none";
    }
  }

  // Logout logic
  function handleLogout(e) {
    if(e) e.preventDefault();
    sessionStorage.removeItem("staffLoggedIn");
    sessionStorage.removeItem("staffName");
    window.location.href = "login.html";
  }

  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  if (logoutBtnMain) logoutBtnMain.addEventListener("click", handleLogout);

});