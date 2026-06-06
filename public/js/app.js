// Global State Management
let currentUser = null;
let currentListings = [];

// DOM Elements
const listingsGrid = document.getElementById('listingsGrid');
const filterForm = document.getElementById('filterForm');
const navPortalBtn = document.getElementById('navPortalBtn');
const authNavItem = document.getElementById('authNavItem');
const portalSection = document.getElementById('portal');
const authFormsContainer = document.getElementById('authFormsContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardWelcome = document.getElementById('dashboardWelcome');
const dashboardRole = document.getElementById('dashboardRole');
const inquiriesTableBody = document.getElementById('inquiriesTableBody');
const tabInquiriesBtn = document.getElementById('tabInquiriesBtn');
const tabAddListingBtn = document.getElementById('tabAddListingBtn');
const tabInquiries = document.getElementById('tabInquiries');
const tabAddListing = document.getElementById('tabAddListing');
const addListingForm = document.getElementById('addListingForm');

// Modal Elements
const propertyModal = document.getElementById('propertyModal');
const propertyModalClose = document.getElementById('modalClose');
const propertyModalBackdrop = document.getElementById('propertyModalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

const inquiryModal = document.getElementById('inquiryModal');
const inquiryModalClose = document.getElementById('inquiryModalClose');
const inquiryModalBackdrop = document.getElementById('inquiryModalBackdrop');
const inquiryForm = document.getElementById('inquiryForm');
const inquiryListingIdInput = document.getElementById('inquiryListingId');

// Format Currency Utility
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

// Fetch Listings from API
async function fetchListings(query = '') {
  try {
    const response = await fetch(`/api/listings${query}`);
    const resData = await response.json();
    if (resData.success) {
      currentListings = resData.data;
      renderListings(currentListings);
    }
  } catch (error) {
    console.error('Failed to fetch property listings:', error);
  }
}

// Render Listings Grid
function renderListings(listings) {
  listingsGrid.innerHTML = '';
  if (listings.length === 0) {
    listingsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-secondary);">
        <p class="serif-font" style="font-size: 1.5rem; margin-bottom: 0.5rem;">No Residences Found</p>
        <p style="font-size: 0.9rem;">Refine your search criteria to view our exclusive portfolio.</p>
      </div>
    `;
    return;
  }

  listings.forEach((listing) => {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.innerHTML = `
      <div class="listing-image-container">
        ${listing.isFeatured ? '<span class="badge-featured">Exclusive Elite</span>' : ''}
        <img src="${listing.imageUrl}" alt="${listing.title}" class="listing-image" onerror="this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'">
        <span class="listing-price-tag">${formatCurrency(listing.price)}</span>
      </div>
      <div class="listing-info">
        <span class="listing-location">${listing.location}</span>
        <h3 class="listing-title">${listing.title}</h3>
        <p class="listing-description">${listing.description}</p>
        <div class="listing-specs">
          <span><strong>${listing.bedrooms}</strong> Beds</span>
          <span><strong>${listing.bathrooms}</strong> Baths</span>
          <span><strong>${listing.areaSqFt.toLocaleString()}</strong> Sq Ft</span>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: auto;">
          <button class="btn-outline" style="flex: 1; padding: 0.5rem 1rem; font-size: 0.82rem;" onclick="openPropertyDetail('${listing.id}')">View Details</button>
          <button class="btn-premium" style="flex: 1; padding: 0.5rem 1rem; font-size: 0.82rem;" onclick="openTourBooking('${listing.id}')">Inquire</button>
        </div>
      </div>
    `;
    listingsGrid.appendChild(card);
  });
}

// Open Property Detail Modal
window.openPropertyDetail = function (id) {
  const listing = currentListings.find((l) => l.id === id);
  if (!listing) return;

  modalTitle.textContent = listing.title;
  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
      <div>
        <img src="${listing.imageUrl}" alt="${listing.title}" style="width: 100%; height: 350px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-gold);" onerror="this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'">
      </div>
      <div>
        <span style="color: var(--accent-gold); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em;">${listing.location}</span>
        <h4 class="serif-font" style="font-size: 2.2rem; margin: 0.5rem 0 1rem; color: var(--accent-gold);">${formatCurrency(listing.price)}</h4>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.7; font-size: 0.95rem;">${listing.description}</p>
        
        <h5 style="text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; color: var(--text-primary); margin-bottom: 0.5rem;">Residence Specifications</h5>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 1rem 0; margin-bottom: 1.5rem;">
          <div><span style="color: var(--text-secondary); font-size: 0.75rem; display: block;">Bedrooms</span><strong>${listing.bedrooms} Beds</strong></div>
          <div><span style="color: var(--text-secondary); font-size: 0.75rem; display: block;">Bathrooms</span><strong>${listing.bathrooms} Baths</strong></div>
          <div><span style="color: var(--text-secondary); font-size: 0.75rem; display: block;">Interior Area</span><strong>${listing.areaSqFt.toLocaleString()} Sq Ft</strong></div>
        </div>

        <h5 style="text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; color: var(--text-primary); margin-bottom: 0.5rem;">Premium Amenities</h5>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem;">${listing.amenities}</p>
        
        <button class="btn-premium" style="width: 100%;" onclick="openTourBooking('${listing.id}'); closeModals();">Request Private Viewing</button>
      </div>
    </div>
  `;
  propertyModal.style.display = 'flex';
};

// Open Tour Booking Modal
window.openTourBooking = function (id) {
  inquiryListingIdInput.value = id;

  // Auto-fill forms if authenticated
  if (currentUser) {
    document.getElementById('inqName').value = currentUser.name;
    document.getElementById('inqEmail').value = currentUser.email;
  } else {
    document.getElementById('inqName').value = '';
    document.getElementById('inqEmail').value = '';
  }

  inquiryModal.style.display = 'flex';
};

// Close Modals
window.closeModals = function () {
  propertyModal.style.display = 'none';
  inquiryModal.style.display = 'none';
};

[propertyModalClose, propertyModalBackdrop, inquiryModalClose, inquiryModalBackdrop].forEach(
  (btn) => {
    btn?.addEventListener('click', closeModals);
  }
);

// Inquiry Submission
inquiryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    listingId: inquiryListingIdInput.value,
    clientName: document.getElementById('inqName').value,
    clientEmail: document.getElementById('inqEmail').value,
    clientPhone: document.getElementById('inqPhone').value,
    requestedTourDate: document.getElementById('inqDate').value || undefined,
    message: document.getElementById('inqMessage').value,
  };

  try {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const resData = await response.json();
    if (resData.success) {
      alert('Your bespoke inquiry has been registered. An agent will contact you shortly.');
      closeModals();
      inquiryForm.reset();
      if (currentUser) {
        loadInquiries(); // refresh list
      }
    } else {
      alert(`Inquiry failed: ${resData.error}`);
    }
  } catch (error) {
    alert('An unexpected network error occurred.');
  }
});

// Search & Filter Panel Submit
filterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const location = document.getElementById('filterLocation').value;
  const minPrice = document.getElementById('filterMinPrice').value;
  const maxPrice = document.getElementById('filterMaxPrice').value;
  const bedrooms = document.getElementById('filterBedrooms').value;

  const params = new URLSearchParams();
  if (location) params.append('location', location);
  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);
  if (bedrooms) params.append('bedrooms', bedrooms);

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  fetchListings(queryStr);
});

// Authentication Handling
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const bodyData = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value,
  };

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });
    const resData = await response.json();
    if (resData.success) {
      currentUser = resData.data.user;
      renderDashboard();
    } else {
      alert(`Authentication failed: ${resData.error}`);
    }
  } catch (error) {
    alert('Authentication network failure.');
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const bodyData = {
    name: document.getElementById('regName').value,
    email: document.getElementById('regEmail').value,
    password: document.getElementById('regPassword').value,
  };

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });
    const resData = await response.json();
    if (resData.success) {
      alert('Registration successful! Please sign in using your credentials.');
      registerForm.reset();
    } else {
      alert(`Registration failed: ${resData.error}`);
    }
  } catch (error) {
    alert('Registration network failure.');
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    currentUser = null;
    renderAuthSection();
  } catch (error) {
    console.error('Logout failed:', error);
  }
});

// Load Current User (Me) Session
async function checkAuthSession() {
  try {
    const response = await fetch('/api/auth/me');
    const resData = await response.json();
    if (resData.success) {
      currentUser = resData.data;
      renderDashboard();
    }
  } catch {
    // Unauthenticated
  }
}

// UI State Toggles for Portal
function renderAuthSection() {
  authFormsContainer.style.display = 'grid';
  dashboardContainer.style.display = 'none';
  authNavItem.innerHTML = `<a href="#portal" class="btn-outline" id="navPortalBtn">Sign In</a>`;

  // Update section headers
  document.getElementById('portalSub').textContent = 'Private Portal';
  document.getElementById('portalTitle').textContent = 'Client & Agent Login';
}

function renderDashboard() {
  authFormsContainer.style.display = 'none';
  dashboardContainer.style.display = 'block';
  authNavItem.innerHTML = `<a href="#portal" class="btn-premium" id="navPortalBtn">Portal Dashboard</a>`;

  dashboardWelcome.textContent = `Welcome, ${currentUser.name}`;
  dashboardRole.textContent = `Premium Account Status: Verified | Access Role: ${currentUser.role.toUpperCase()}`;

  // Reset tab buttons
  tabInquiriesBtn.classList.add('active');
  tabAddListingBtn.classList.remove('active');
  tabInquiries.classList.add('active');
  tabAddListing.classList.remove('active');

  // Toggle listing inputs visibility based on role (agent/admin)
  if (currentUser.role === 'agent' || currentUser.role === 'admin') {
    tabAddListingBtn.style.display = 'block';
    document.getElementById('portalSub').textContent = 'Workspace Dashboard';
    document.getElementById('portalTitle').textContent = 'Bespoke Brokerage Console';
  } else {
    tabAddListingBtn.style.display = 'none';
    document.getElementById('portalSub').textContent = 'Client Workspace';
    document.getElementById('portalTitle').textContent = 'My Booking Requests';
  }

  loadInquiries();
}

// Fetch and load Inquiries
async function loadInquiries() {
  try {
    const response = await fetch('/api/inquiries');
    const resData = await response.json();
    if (resData.success) {
      renderInquiries(resData.data);
    }
  } catch (error) {
    console.error('Failed to load inquiries:', error);
  }
}

function renderInquiries(inquiries) {
  inquiriesTableBody.innerHTML = '';
  if (inquiries.length === 0) {
    inquiriesTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 3rem 0;">
          No tour inquiries or bookings registered yet.
        </td>
      </tr>
    `;
    return;
  }

  inquiries.forEach((inq) => {
    const dateStr = new Date(inq.createdAt).toLocaleDateString();
    const tourDate = inq.requestedTourDate
      ? new Date(inq.requestedTourDate).toLocaleDateString()
      : 'N/A';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${dateStr}</td>
      <td><strong>${inq.clientName}</strong></td>
      <td>${inq.clientEmail}<br><span style="font-size:0.8rem; color:var(--text-secondary)">${inq.clientPhone}</span></td>
      <td><strong>${inq.listing.title}</strong><br><span style="font-size:0.8rem; color:var(--accent-gold)">${formatCurrency(inq.listing.price)}</span></td>
      <td><span style="color:var(--accent-gold); font-weight:600">${tourDate}</span></td>
      <td style="max-width:250px; white-space:normal">${inq.message}</td>
    `;
    inquiriesTableBody.appendChild(row);
  });
}

// Tab Controls
tabInquiriesBtn.addEventListener('click', () => {
  tabInquiriesBtn.classList.add('active');
  tabAddListingBtn.classList.remove('active');
  tabInquiries.classList.add('active');
  tabAddListing.classList.remove('active');
});

tabAddListingBtn.addEventListener('click', () => {
  tabAddListingBtn.classList.add('active');
  tabInquiriesBtn.classList.remove('active');
  tabAddListing.classList.add('active');
  tabInquiries.classList.remove('active');
});

// Publish New Listing
addListingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const listingData = {
    title: document.getElementById('listTitle').value,
    location: document.getElementById('listLocation').value,
    price: parseFloat(document.getElementById('listPrice').value),
    imageUrl: document.getElementById('listImage').value,
    bedrooms: parseInt(document.getElementById('listBeds').value),
    bathrooms: parseFloat(document.getElementById('listBaths').value),
    areaSqFt: parseFloat(document.getElementById('listArea').value),
    amenities: document.getElementById('listAmenities').value,
    description: document.getElementById('listDescription').value,
  };

  try {
    const response = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData),
    });
    const resData = await response.json();
    if (resData.success) {
      alert('Listing published successfully!');
      addListingForm.reset();

      // Go back to listings and inquiries tab
      tabInquiriesBtn.click();
      fetchListings(); // reload grid
    } else {
      alert(`Failed to add listing: ${resData.error}`);
    }
  } catch (error) {
    alert('Listing upload network error.');
  }
});

// Portal Navigation triggers showing the portal
function showPortalSection() {
  portalSection.style.display = 'block';
  // Scroll to portal
  portalSection.scrollIntoView({ behavior: 'smooth' });
}

navPortalBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  showPortalSection();
});

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'navPortalBtn') {
    e.preventDefault();
    showPortalSection();
  }
});

// App Entry Point
document.addEventListener('DOMContentLoaded', () => {
  fetchListings();
  checkAuthSession();
});
