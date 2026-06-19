/* C:\Users\callu\Documents\antigravity\focused-shannon\app.js */

// Global Constant Table Definitions (Bar Counter seats organized in twos: 71, 73, 75...)
const TABLES = [
  { id: "1", type: "table", minPax: 5, maxPax: 8, name: "Table 1 (Big Group Table)", section: "Dining Room" },
  { id: "4", type: "table", minPax: 3, maxPax: 4, name: "Table 4 (Dining Table)", section: "Dining Room" },
  { id: "5", type: "table", minPax: 3, maxPax: 4, name: "Table 5 (Dining Table)", section: "Dining Room" },
  { id: "6", type: "table", minPax: 3, maxPax: 4, name: "Table 6 (Dining Table)", section: "Dining Room" },
  
  { id: "21", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 2 - Corner 21", section: "Sharing Table 2" },
  { id: "22", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 2 - Corner 22", section: "Sharing Table 2" },
  { id: "23", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 2 - Corner 23", section: "Sharing Table 2" },
  { id: "24", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 2 - Corner 24", section: "Sharing Table 2" },
  
  { id: "31", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 3 - Corner 31", section: "Sharing Table 3" },
  { id: "32", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 3 - Corner 32", section: "Sharing Table 3" },
  { id: "33", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 3 - Corner 33", section: "Sharing Table 3" },
  { id: "34", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 3 - Corner 34", section: "Sharing Table 3" },
  
  // Yakitori Grill Counter (A) Seats - Organized into twos
  { id: "71", type: "seat", minPax: 1, maxPax: 2, name: "Yakitori Grill Table 71 (2 Seats)", section: "Grill Counter" },
  { id: "73", type: "seat", minPax: 1, maxPax: 2, name: "Yakitori Grill Table 73 (2 Seats)", section: "Grill Counter" },
  { id: "75", type: "seat", minPax: 1, maxPax: 2, name: "Yakitori Grill Table 75 (2 Seats)", section: "Grill Counter" },
  { id: "77", type: "seat", minPax: 1, maxPax: 2, name: "Yakitori Grill Table 77 (2 Seats)", section: "Grill Counter" },
  { id: "79", type: "seat", minPax: 1, maxPax: 2, name: "Yakitori Grill Table 79 (2 Seats)", section: "Grill Counter" },
  
  // Sake Bar Counter (B) Seats - Organized into twos
  { id: "81", type: "seat", minPax: 1, maxPax: 2, name: "Sake Bar Table 81 (2 Seats)", section: "Sake Bar" },
  { id: "83", type: "seat", minPax: 1, maxPax: 2, name: "Sake Bar Table 83 (2 Seats)", section: "Sake Bar" },
  { id: "85", type: "seat", minPax: 1, maxPax: 2, name: "Sake Bar Table 85 (2 Seats)", section: "Sake Bar" },
  { id: "87", type: "seat", minPax: 1, maxPax: 1, name: "Sake Bar Table 87 (1 Seat)", section: "Sake Bar" },
  
  // Courtenay Balcony (Outside)
  { id: "91", type: "outdoor", minPax: 1, maxPax: 2, name: "Balcony Table 91", section: "Balcony" },
  { id: "92", type: "outdoor", minPax: 1, maxPax: 2, name: "Balcony Table 92", section: "Balcony" },
  { id: "93", type: "outdoor", minPax: 1, maxPax: 2, name: "Balcony Table 93", section: "Balcony" },
  
  // Tatami Corners / Booths
  { id: "95", type: "corner", minPax: 1, maxPax: 2, name: "Tatami Booth 95", section: "Tatami Booths" },
  { id: "96", type: "corner", minPax: 1, maxPax: 2, name: "Tatami Booth 96", section: "Tatami Booths" }
];

// 2 Hour slot duration (120 minutes)
const BOOKING_DURATION_MINS = 120;

// Application State
let bookingState = {
  step: 1,
  date: "",
  partySize: 2,
  timeRange: "all",
  timeSlot: "",
  tableId: "",
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  specialRequests: ""
};

// UI Elements
const settingsDrawer = document.getElementById("settings-drawer");
const btnToggleSettings = document.getElementById("btn-toggle-settings");
const btnCloseSettings = document.getElementById("btn-close-settings");
const settingsForm = document.getElementById("settings-form");
const btnResetSettings = document.getElementById("btn-reset-settings");

// Form Inputs
const manualNameInput = document.getElementById("manual-name");
const manualPhoneInput = document.getElementById("manual-phone");
const manualDateInput = document.getElementById("manual-date");
const manualTimeSelect = document.getElementById("manual-time");
const manualPaxSelect = document.getElementById("manual-pax");
const manualTableSelect = document.getElementById("manual-table");
const manualNotesInput = document.getElementById("manual-notes");

// Conflict modal
const conflictModalBackdrop = document.getElementById("conflict-modal-backdrop");
const btnModalCancel = document.getElementById("btn-modal-cancel");
const btnModalOverride = document.getElementById("btn-modal-override");

// Simulated Email logs
let processedEmails = [];

// System settings cache
let systemSettings = {
  email: "bookings@kazu.co.nz",
  openTime: "17:00",
  closeTime: "22:00"
};

// Temporary variables for conflict bypass
let pendingOverrideBooking = null;

// Initialize Page Elements
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  initFormTimeDropdowns();
  initTableAssignmentDropdowns();
  
  // Set default dates
  const todayStr = new Date().toISOString().split("T")[0];
  manualDateInput.value = todayStr;
  manualDateInput.min = todayStr;
  document.getElementById("view-date").value = todayStr;
  
  // Re-generate time slots list when date picker value changes
  manualDateInput.addEventListener("change", () => {
    initFormTimeDropdowns();
    suggestBestTable();
  });
  
  // Initial renders
  renderBookingsList();
  renderEmailLog();
  
  // Initialize floor plan snapshot dropdown and events
  initSnapshotTimeDropdown();
  initFloorPlanView();
  
  // Suggest best table on load
  suggestBestTable();
  
  // Bind Event Listeners
  document.getElementById("phone-booking-form").addEventListener("submit", handleManualSubmit);
  document.getElementById("view-date").addEventListener("change", () => {
    renderBookingsList();
    updateFloorPlanVisualState();
  });
  document.getElementById("btn-print-sheet").addEventListener("click", () => window.print());
  
  // Settings Panel Bindings
  btnToggleSettings.addEventListener("click", openSettingsDrawer);
  btnCloseSettings.addEventListener("click", closeSettingsDrawer);
  settingsForm.addEventListener("submit", saveSettings);
  btnResetSettings.addEventListener("click", resetSettings);
  
  // Conflict Dialog Bindings
  btnModalCancel.addEventListener("click", cancelConflictBypass);
  btnModalOverride.addEventListener("click", confirmConflictBypass);
  
  // Email Simulator Bindings
  document.getElementById("email-preset").addEventListener("change", handleEmailPresetChange);
  document.getElementById("btn-simulate-email").addEventListener("click", handleEmailSimulation);
  
  // View Switcher Bindings
  const btnViewList = document.getElementById("btn-view-list");
  const btnViewFloorplan = document.getElementById("btn-view-floorplan");
  const listViewContent = document.getElementById("list-view-content");
  const floorplanViewContent = document.getElementById("floorplan-view-content");
  const floorplanTimeSelector = document.getElementById("floorplan-time-selector");
  const snapshotTimeSelect = document.getElementById("snapshot-time");

  btnViewList.addEventListener("click", () => {
    btnViewList.classList.add("active-btn");
    btnViewFloorplan.classList.remove("active-btn");
    listViewContent.style.display = "block";
    floorplanViewContent.style.display = "none";
    floorplanTimeSelector.style.display = "none";
  });

  btnViewFloorplan.addEventListener("click", () => {
    btnViewFloorplan.classList.add("active-btn");
    btnViewList.classList.remove("active-btn");
    listViewContent.style.display = "none";
    floorplanViewContent.style.display = "block";
    floorplanTimeSelector.style.display = "flex";
    updateFloorPlanVisualState();
  });

  if (snapshotTimeSelect) {
    snapshotTimeSelect.addEventListener("change", updateFloorPlanVisualState);
  }

  // Auto-suggest table on manual form changes
  manualPaxSelect.addEventListener("change", suggestBestTable);
  manualTimeSelect.addEventListener("change", suggestBestTable);

  // Seating Optimizer button binding
  const btnOptimizeSeating = document.getElementById("btn-optimize-seating");
  if (btnOptimizeSeating) {
    btnOptimizeSeating.addEventListener("click", () => {
      const viewDate = document.getElementById("view-date").value;
      runSeatingOptimizer(viewDate);
    });
  }

  const btnCloseOptimizerReport = document.getElementById("btn-close-optimizer-report");
  if (btnCloseOptimizerReport) {
    btnCloseOptimizerReport.addEventListener("click", () => {
      document.getElementById("optimizer-modal-backdrop").classList.remove("active");
    });
  }
});

// Time conversion utilities
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// Converts HH:MM (24h) to 12h AM/PM
function format12Hour(time24) {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const mStr = m === 0 ? "00" : m < 10 ? `0${m}` : m;
  return `${h12}:${mStr} ${ampm}`;
}

// Converts 12h AM/PM string to 24h format HH:MM
function convert12hTo24h(time12) {
  const clean = time12.trim().toUpperCase();
  const match = clean.match(/^(\d+):(\d+)\s*(AM|PM)$/);
  if (!match) return "18:00";
  
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3];
  
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  
  const hStr = hours < 10 ? `0${hours}` : hours;
  return `${hStr}:${minutes}`;
}

// Load configurations from localStorage
function loadSettings() {
  const saved = localStorage.getItem("kazu_system_settings");
  if (saved) {
    systemSettings = JSON.parse(saved);
  } else {
    localStorage.setItem("kazu_system_settings", JSON.stringify(systemSettings));
    setTimeout(() => {
      openSettingsDrawer();
      alert("Welcome! Please configure Kazu's monitored email address on first run.");
    }, 800);
  }
  
  document.getElementById("active-email-display").textContent = `(Monitoring: ${systemSettings.email})`;
}

// Save system configurations
function saveSettings(e) {
  e.preventDefault();
  
  systemSettings.email = document.getElementById("settings-email").value.trim() || "bookings@kazu.co.nz";
  systemSettings.openTime = document.getElementById("settings-open-time").value;
  
  localStorage.setItem("kazu_system_settings", JSON.stringify(systemSettings));
  
  document.getElementById("active-email-display").textContent = `(Monitoring: ${systemSettings.email})`;
  closeSettingsDrawer();
  
  initFormTimeDropdowns();
  alert("Settings saved successfully!");
  renderBookingsList();
  initSnapshotTimeDropdown();
  updateFloorPlanVisualState();
}

function resetSettings() {
  if (confirm("Reset settings to default? (Opening Hours start at 5:00 PM)")) {
    systemSettings = {
      email: "bookings@kazu.co.nz",
      openTime: "17:00",
      closeTime: "22:00"
    };
    localStorage.setItem("kazu_system_settings", JSON.stringify(systemSettings));
    
    document.getElementById("settings-email").value = systemSettings.email;
    document.getElementById("settings-open-time").value = systemSettings.openTime;
    
    document.getElementById("active-email-display").textContent = `(Monitoring: ${systemSettings.email})`;
    initFormTimeDropdowns();
    renderBookingsList();
    initSnapshotTimeDropdown();
    updateFloorPlanVisualState();
  }
}

// Populate Time dropdowns bounded by opening hours and weekday/weekend rules
function initFormTimeDropdowns() {
  const manualDate = manualDateInput.value;
  const settingsOpen = document.getElementById("settings-open-time");
  
  const allSlots = [];
  for (let h = 0; h < 24; h++) {
    const hStr = h < 10 ? `0${h}` : h;
    allSlots.push(`${hStr}:00`, `${hStr}:30`);
  }
  
  if (settingsOpen.children.length === 0) {
    allSlots.forEach(slot => {
      const opt = new Option(format12Hour(slot), slot);
      settingsOpen.add(opt);
    });
    const settingsClose = document.getElementById("settings-close-time");
    if (settingsClose && settingsClose.parentElement) {
      settingsClose.parentElement.style.display = "none";
    }
  }
  
  settingsOpen.value = systemSettings.openTime;
  manualTimeSelect.innerHTML = "";
  
  if (!manualDate) return;
  
  const dateObj = new Date(manualDate);
  const dayOfWeek = dateObj.getDay();
  
  const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6);
  const maxTimeStr = isWeekend ? "20:30" : "20:00";
  
  const startMins = timeToMinutes(systemSettings.openTime);
  const endMins = timeToMinutes(maxTimeStr);
  
  allSlots.forEach(slot => {
    const slotMins = timeToMinutes(slot);
    if (slotMins >= startMins && slotMins <= endMins) {
      const display = format12Hour(slot);
      manualTimeSelect.add(new Option(display, slot));
    }
  });
}

// Populate table selections dropdown
function initTableAssignmentDropdowns() {
  manualTableSelect.innerHTML = "";
  
  const sections = {};
  TABLES.forEach(t => {
    if (!sections[t.section]) sections[t.section] = [];
    sections[t.section].push(t);
  });
  
  for (const [sectionName, tablesList] of Object.entries(sections)) {
    const optGroup = document.createElement("optgroup");
    optGroup.label = sectionName;
    
    tablesList.forEach(t => {
      let displayName = t.name;
      optGroup.appendChild(new Option(displayName, t.id));
    });
    manualTableSelect.appendChild(optGroup);
  }
}

// Open/Close Settings
function openSettingsDrawer() { settingsDrawer.classList.add("active"); }
function closeSettingsDrawer() { settingsDrawer.classList.remove("active"); }

// Get reservations from local storage
function getReservations() {
  const data = localStorage.getItem("kazu_backend_reservations");
  return data ? JSON.parse(data) : [];
}

// Save all reservations
function saveAllReservations(reservations) {
  localStorage.setItem("kazu_backend_reservations", JSON.stringify(reservations));
}

// Conflict checking engine (2-hour limit check)
function checkConflict(tableId, date, time24, skipRefCode = null) {
  const reservations = getReservations().filter(r => r.date === date && r.status !== "Cancelled" && r.id !== skipRefCode);
  const targetMins = timeToMinutes(time24);
  const targetTableIds = tableId.split(",");
  
  for (const res of reservations) {
    const resMins = timeToMinutes(res.timeSlot);
    if (Math.abs(resMins - targetMins) < BOOKING_DURATION_MINS) {
      const resTableIds = res.tableId.split(",");
      const hasTableOverlap = resTableIds.some(id => targetTableIds.includes(id));
      if (hasTableOverlap) {
        return res;
      }
    }
  }
  return null;
}

// Handle Manual Form Submission
function handleManualSubmit(e) {
  e.preventDefault();
  
  const name = manualNameInput.value.trim();
  const phone = manualPhoneInput.value.trim();
  const date = manualDateInput.value;
  const timeSlot = manualTimeSelect.value;
  const partySize = parseInt(manualPaxSelect.value, 10);
  const tableId = manualTableSelect.value;
  const notes = manualNotesInput.value.trim();
  
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6);
  const maxTimeStr = isWeekend ? "20:30" : "20:00";
  const startMins = timeToMinutes(systemSettings.openTime);
  const endMins = timeToMinutes(maxTimeStr);
  const targetMins = timeToMinutes(timeSlot);
  
  if (targetMins < startMins || targetMins > endMins) {
    alert(`Invalid time selection: bookings for this date must be between ${format12Hour(systemSettings.openTime)} and ${format12Hour(maxTimeStr)}.`);
    return;
  }
  
  const selectedTableInfo = TABLES.find(t => t.id === tableId);
  if (partySize < selectedTableInfo.minPax || partySize > selectedTableInfo.maxPax) {
    alert(`Capacity mismatch: ${selectedTableInfo.name} only accommodates ${selectedTableInfo.minPax} to ${selectedTableInfo.maxPax} guests. Please assign a suitable table.`);
    return;
  }
  
  const refCode = `KAZU-${Math.floor(1000 + Math.random() * 9000)}`;
  const bookingObj = {
    id: refCode,
    guestName: name,
    guestPhone: phone,
    date: date,
    timeSlot: timeSlot,
    partySize: partySize,
    tableId: tableId,
    specialRequests: notes,
    status: "Confirmed",
    hasConflict: false
  };
  
  const conflictBooking = checkConflict(tableId, date, timeSlot);
  if (conflictBooking) {
    triggerConflictModal(bookingObj, conflictBooking);
  } else {
    saveBookingDirectly(bookingObj);
  }
}

// Direct Save (No conflict)
function saveBookingDirectly(booking) {
  const current = getReservations();
  current.push(booking);
  saveAllReservations(current);
  
  alert(`Reservation saved successfully for ${booking.guestName} (Ref: ${booking.id})`);
  resetManualForm();
  renderBookingsList();
  updateFloorPlanVisualState();
}

// Reset manual form
function resetManualForm() {
  manualNameInput.value = "";
  manualPhoneInput.value = "";
  manualNotesInput.value = "";
  manualPaxSelect.value = "2";
  manualDateInput.value = new Date().toISOString().split("T")[0];
  initFormTimeDropdowns();
  suggestBestTable();
}

// Trigger Conflict Alert Modal
function triggerConflictModal(newBooking, existingBooking) {
  pendingOverrideBooking = newBooking;
  
  const newText = `Ref: Pending | <strong>${newBooking.guestName}</strong> at <strong>${format12Hour(newBooking.timeSlot)}</strong> (Table/Seat: ${formatTableDisplay(newBooking.tableId)})`;
  const existingText = `Ref: ${existingBooking.id} | <strong>${existingBooking.guestName}</strong> at <strong>${format12Hour(existingBooking.timeSlot)}</strong> (Table/Seat: ${formatTableDisplay(existingBooking.tableId)})`;
  
  document.getElementById("conflict-new-details").innerHTML = newText;
  document.getElementById("conflict-existing-details").innerHTML = existingText;
  
  conflictModalBackdrop.classList.add("active");
}

function cancelConflictBypass() {
  pendingOverrideBooking = null;
  conflictModalBackdrop.classList.remove("active");
}

function confirmConflictBypass() {
  if (pendingOverrideBooking) {
    pendingOverrideBooking.hasConflict = true;
    const current = getReservations();
    current.push(pendingOverrideBooking);
    saveAllReservations(current);
    
    alert(`Reservation overridden & saved (Ref: ${pendingOverrideBooking.id})`);
    pendingOverrideBooking = null;
    
    conflictModalBackdrop.classList.remove("active");
    resetManualForm();
    renderBookingsList();
    updateFloorPlanVisualState();
  }
}

// Render Bookings List
function renderBookingsList() {
  const viewDate = document.getElementById("view-date").value;
  const listTbody = document.getElementById("bookings-list-tbody");
  const noMsg = document.getElementById("no-bookings-msg");
  
  document.getElementById("current-day-label").textContent = new Date(viewDate).toLocaleDateString("en-NZ", {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'
  });
  
  const allReservations = getReservations().filter(r => r.date === viewDate);
  const activeBookings = allReservations.filter(r => r.status !== "Cancelled");
  
  const totalCovers = activeBookings.reduce((sum, r) => sum + r.partySize, 0);
  const occupiedTables = new Set();
  activeBookings.forEach(r => r.tableId.split(",").forEach(id => occupiedTables.add(id)));
  const occupancyPercentage = Math.round((occupiedTables.size / TABLES.length) * 100) || 0;
  
  document.getElementById("stat-total").textContent = activeBookings.length;
  document.getElementById("stat-guests").textContent = totalCovers;
  document.getElementById("stat-occupancy").textContent = `${occupancyPercentage}%`;
  
  allReservations.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  
  listTbody.innerHTML = "";
  
  if (allReservations.length === 0) {
    noMsg.style.display = "block";
    return;
  }
  
  noMsg.style.display = "none";
  
  allReservations.forEach(res => {
    const tr = document.createElement("tr");
    
    let badgeHtml = "";
    if (res.hasConflict && res.status !== "Cancelled") {
      badgeHtml += `<span class="badge-conflict" title="Confirmed despite overlap conflict">⚠️ Conflict Overruled</span> `;
    }
    
    let statusClass = "badge-confirmed";
    if (res.status === "Checked In") statusClass = "badge-checkedin";
    
    let statusHtml = `<span class="badge-status ${statusClass}">${res.status}</span>`;
    if (res.status === "Cancelled") {
      statusHtml = `<span class="badge-status" style="background: rgba(231,76,60,0.12); color: #e74c3c; border: 1px solid rgba(231,76,60,0.25);">${res.status}</span>`;
    }
    
    if (res.hasConflict && res.status !== "Cancelled") {
      tr.className = "row-conflict";
    }
    
    let actionsHtml = "";
    if (res.status === "Confirmed") {
      actionsHtml = `
        <div class="action-btn-group">
          <button class="action-icon checkin" onclick="changeStatus('${res.id}', 'Checked In')" title="Check In Guest">✔</button>
          <button class="action-icon cancel" onclick="changeStatus('${res.id}', 'Cancelled')" title="Cancel Reservation">✖</button>
        </div>
      `;
    } else if (res.status === "Checked In") {
      actionsHtml = `
        <div class="action-btn-group">
          <button class="action-icon cancel" onclick="changeStatus('${res.id}', 'Cancelled')" title="Cancel Reservation">✖</button>
        </div>
      `;
    } else {
      actionsHtml = `<span style="font-size: 0.8rem; font-style: italic; color: var(--color-text-muted);">Cancelled</span>`;
    }
    
    tr.innerHTML = `
      <td style="font-weight: bold; color: var(--color-text-light);">${format12Hour(res.timeSlot)}</td>
      <td>
        <div style="font-weight: 600; color: var(--color-text-light);">${res.guestName}</div>
        <div style="font-size: 0.8rem; color: var(--color-text-muted);">${res.guestPhone}</div>
        ${res.specialRequests ? `<div style="font-size: 0.8rem; color: var(--color-accent); font-style: italic; margin-top: 0.15rem;">💬 "${res.specialRequests}"</div>` : ""}
      </td>
      <td>${res.partySize}</td>
      <td style="font-weight: 500;">
        <div>${formatTableDisplay(res.tableId)}</div>
        <div style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: normal;">Duration: up to 2 hours</div>
      </td>
      <td>
        <div style="margin-bottom: 0.2rem;">${statusHtml}</div>
        <div>${badgeHtml}</div>
      </td>
      <td>${actionsHtml}</td>
    `;
    listTbody.appendChild(tr);
  });
}

// Format table ID strings
function formatTableDisplay(tableId) {
  const ids = tableId.split(",");
  if (ids.length > 1) {
    const names = ids.map(id => {
      const info = TABLES.find(t => t.id === id);
      return info ? info.name : `Table ${id}`;
    });
    return names.join(", ");
  } else {
    const info = TABLES.find(t => t.id === ids[0]);
    return info ? info.name : `Table ${tableId}`;
  }
}

// Global action handler
window.changeStatus = function(refCode, newStatus) {
  const current = getReservations();
  const index = current.findIndex(r => r.id === refCode);
  if (index !== -1) {
    current[index].status = newStatus;
    saveAllReservations(current);
    renderBookingsList();
    updateFloorPlanVisualState();
  }
};

// ==========================================
// MOCK EMAIL INTEGRATION ENGINE
// ==========================================

const EMAIL_TEMPLATES = {
  "1": {
    subject: "Table Booking Request",
    sender: "tanaka.kenji@gmail.com",
    body: "Hi Kazu Team,\n\nI would like to make a table reservation for 2 people under Sato Kenji on 2026-06-15 at 6:30 PM. My contact phone number is 027 493 2847. \n\nLooking forward to some Tsukune!\n\nBest,\nKenji"
  },
  "2": {
    subject: "Corporate Dinner Reservation",
    sender: "events@fpcnz.co.nz",
    body: "Hello Kazu Sake Bar,\n\nCould we book the big table for 8 people on 2026-06-15 at 7:30 PM? Please put this under FPCNZ. Our callback number is 04 802 4868. We'd like to try some of your premium sakes.\n\nThank you,\nFPCNZ Events Team"
  },
  "3": {
    subject: "Izakaya table",
    sender: "liam@techcorp.co.nz",
    body: "Hi there, looking to grab a late table for 2 people at 10:00 PM on 2026-06-15. Under the name Liam, phone 021 756 3810. Cheers!"
  }
};

function handleEmailPresetChange() {
  const val = document.getElementById("email-preset").value;
  const customWrapper = document.getElementById("custom-email-wrapper");
  const customText = document.getElementById("email-custom-text");
  
  if (val === "custom") {
    customWrapper.style.display = "block";
    customText.value = "";
  } else {
    customWrapper.style.display = "none";
    if (val !== "0") {
      customText.value = EMAIL_TEMPLATES[val].body;
    } else {
      customText.value = "";
    }
  }
}

function handleEmailSimulation() {
  const val = document.getElementById("email-preset").value;
  const rawText = document.getElementById("email-custom-text").value.trim();
  
  if (val === "0") {
    alert("Please select a template or paste custom email body to simulate.");
    return;
  }
  
  let subject = "Inquiry: Table Reservation";
  let sender = "inquiries@customer.co.nz";
  
  if (val !== "custom") {
    subject = EMAIL_TEMPLATES[val].subject;
    sender = EMAIL_TEMPLATES[val].sender;
  }
  
  const parsed = parseEmailBody(rawText);
  if (!parsed) {
    alert("Error: Could not parse booking details from the email text.");
    return;
  }
  
  const d = new Date(parsed.date);
  const dayOfWeek = d.getDay();
  const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6);
  const maxTimeStr = isWeekend ? "20:30" : "20:00";
  const startMins = timeToMinutes(systemSettings.openTime);
  const endMins = timeToMinutes(maxTimeStr);
  const targetMins = timeToMinutes(parsed.timeSlot);
  
  const timeValid = (targetMins >= startMins && targetMins <= endMins);
  const allocatedTable = autoAllocateTable(parsed.partySize, parsed.date, parsed.timeSlot);
  
  const refCode = `KAZU-${Math.floor(1000 + Math.random() * 9000)}`;
  const bookingObj = {
    id: refCode,
    guestName: parsed.name,
    guestPhone: parsed.phone,
    date: parsed.date,
    timeSlot: parsed.timeSlot,
    partySize: parsed.partySize,
    tableId: allocatedTable ? allocatedTable.id : "1",
    specialRequests: `Imported from email (${sender})`,
    status: "Confirmed",
    hasConflict: false
  };
  
  const emailLogObj = {
    id: refCode,
    sender: sender,
    subject: subject,
    parsedData: parsed,
    booking: bookingObj,
    status: "Auto-Saved"
  };
  
  if (!timeValid) {
    emailLogObj.status = "Manual Review";
    emailLogObj.booking.hasConflict = true;
    emailLogObj.booking.specialRequests += ` [ALERT: Past Allowed Hours (${format12Hour(maxTimeStr)})]`;
    processedEmails.push(emailLogObj);
    alert(`⚠️ Email Parsed! The requested time ${format12Hour(parsed.timeSlot)} is outside allowed hours (Limits: ${format12Hour(systemSettings.openTime)} - ${format12Hour(maxTimeStr)}). Surfaced in log for review.`);
  } else if (allocatedTable && allocatedTable.isConflicted) {
    emailLogObj.status = "Manual Review";
    emailLogObj.booking.hasConflict = true;
    processedEmails.push(emailLogObj);
    alert(`⚠️ Email Parsed! A booking conflict was detected for ${parsed.name} at ${format12Hour(parsed.timeSlot)}. Surfacing in log for review.`);
  } else if (!allocatedTable) {
    emailLogObj.status = "Manual Review";
    emailLogObj.booking.hasConflict = true;
    processedEmails.push(emailLogObj);
    alert(`⚠️ Email Parsed! No clean tables available for party of ${parsed.partySize} at ${format12Hour(parsed.timeSlot)}. Surfaced in log for manual review.`);
  } else {
    emailLogObj.status = "Auto-Saved";
    const current = getReservations();
    current.push(bookingObj);
    saveAllReservations(current);
    processedEmails.push(emailLogObj);
    
    alert(`✓ Email Auto-Imported! Reservation saved successfully for ${parsed.name} (Table ${allocatedTable.display}).`);
  }
  
  renderEmailLog();
  renderBookingsList();
  
  document.getElementById("email-preset").value = "0";
  document.getElementById("email-custom-text").value = "";
  document.getElementById("custom-email-wrapper").style.display = "none";
}

// Helper: Auto allocate a table based on rules
function autoAllocateTable(partySize, date, timeSlot) {
  let eligibleTables = TABLES.filter(t => partySize >= t.minPax && partySize <= t.maxPax);
  if (eligibleTables.length === 0) return null;
  
  // Apply priority seating logic for party size of 2
  if (partySize === 2) {
    const priority = ["75", "73", "77", "71", "79", "81", "83", "87", "85", "95", "96"];
    eligibleTables.sort((a, b) => {
      const indexA = priority.indexOf(a.id);
      const indexB = priority.indexOf(b.id);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  }
  
  for (const t of eligibleTables) {
    const overlap = checkConflict(t.id, date, timeSlot);
    if (!overlap) {
      return { id: t.id, display: formatTableDisplay(t.id), isConflicted: false };
    }
  }
  
  const firstTable = eligibleTables[0];
  return { id: firstTable.id, display: formatTableDisplay(firstTable.id), isConflicted: true };
}

// Auto-suggest the best available table for the manual form inputs
function suggestBestTable() {
  const partySize = parseInt(manualPaxSelect.value, 10);
  const date = manualDateInput.value;
  const timeSlot = manualTimeSelect.value;
  if (!date || !timeSlot) return;
  const suggested = autoAllocateTable(partySize, date, timeSlot);
  if (suggested) {
    manualTableSelect.value = suggested.id;
  }
}

// Regex parsing engine for simulated email bodies
function parseEmailBody(bodyText) {
  try {
    let name = "";
    let phone = "";
    let date = "";
    let timeSlot = "";
    let partySize = 2;
    
    const nameMatch = bodyText.match(/(?:under the name|under|name is|name:)\s*([A-Za-z\s]+)/i);
    if (nameMatch) name = nameMatch[1].trim();
    
    const phoneMatch = bodyText.match(/(?:phone number is|phone|tel|contact|number is)\s*([0-9\s\-]{7,15})/i);
    if (phoneMatch) phone = phoneMatch[1].trim();
    
    const partyMatch = bodyText.match(/(?:table for|for|party of)\s*(\d+)\s*(?:people|person|pax)?/i);
    if (partyMatch) {
      partySize = parseInt(partyMatch[1], 10);
    } else {
      const paxMatch = bodyText.match(/(\d+)\s*(?:pax|people|person)/i);
      if (paxMatch) partySize = parseInt(paxMatch[1], 10);
    }
    
    const dateMatch = bodyText.match(/(?:on|date:)\s*([0-9]{4}\-[0-9]{2}\-[0-9]{2})/i);
    if (dateMatch) {
      date = dateMatch[1].trim();
    } else {
      date = new Date().toISOString().split("T")[0];
    }
    
    const timeMatch = bodyText.match(/(?:at|time:)\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?|\d{1,2}\s*(?:AM|PM))/i);
    if (timeMatch) {
      let timeStr = timeMatch[1].trim();
      if (!timeStr.includes(":")) {
        const parts = timeStr.match(/^(\d+)\s*(AM|PM)$/i);
        if (parts) {
          timeStr = `${parts[1]}:00 ${parts[2]}`;
        }
      }
      timeSlot = convert12hTo24h(timeStr);
    } else {
      timeSlot = "18:00";
    }
    
    if (!name) name = "Email Guest";
    if (!phone) phone = "021-EMAIL";
    
    return { name, phone, date, partySize, timeSlot };
  } catch (err) {
    console.error("Parser failed:", err);
    return null;
  }
}

// Render Email Inbox Log in Middle Column
function renderEmailLog() {
  const container = document.getElementById("email-log-container");
  const countLabel = document.getElementById("log-count");
  
  countLabel.textContent = `(${processedEmails.length})`;
  
  if (processedEmails.length === 0) {
    container.innerHTML = `
      <p style="color: var(--color-text-muted); font-style: italic; text-align: center; margin-top: 2rem; font-size: 0.85rem;">
        No emails processed in this session.
      </p>
    `;
    return;
  }
  
  container.innerHTML = "";
  
  [...processedEmails].reverse().forEach(log => {
    const item = document.createElement("div");
    item.className = "email-log-item";
    
    let statusClass = "status-autosave";
    if (log.status === "Manual Review") statusClass = "status-pending";
    else if (log.status === "Resolved") statusClass = "status-resolved";
    
    let actionBtnHtml = "";
    if (log.status === "Manual Review") {
      actionBtnHtml = `
        <button class="btn btn-primary" style="font-size: 0.75rem; padding: 0.25rem 0.5rem; margin-top: 0.4rem; background: var(--color-primary);"
                onclick="triggerEmailReview('${log.id}')">
          Review & Resolve
        </button>
      `;
    }
    
    item.innerHTML = `
      <div class="email-log-header">
        <span class="email-log-subject">${log.subject}</span>
        <span class="email-log-status ${statusClass}">${log.status}</span>
      </div>
      <div style="font-size: 0.8rem; color: var(--color-text-light);">From: ${log.sender}</div>
      <div class="email-log-details">
        Parsed: <strong>${log.parsedData.name}</strong> (${log.parsedData.partySize} pax) on <strong>${log.parsedData.date}</strong> at <strong>${format12Hour(log.parsedData.timeSlot)}</strong>
      </div>
      ${actionBtnHtml}
    `;
    container.appendChild(item);
  });
}

// Review pending email booking
window.triggerEmailReview = function(refCode) {
  const log = processedEmails.find(e => e.id === refCode);
  if (!log) return;
  
  const conflict = checkConflict(log.booking.tableId, log.booking.date, log.booking.timeSlot);
  
  triggerConflictModal(log.booking, conflict || { guestName: "Requested Out-Of-Bounds Time Slot", timeSlot: log.booking.timeSlot, id: "N/A", tableId: log.booking.tableId });
  
  const originalOverride = confirmConflictBypass;
  confirmConflictBypass = function() {
    originalOverride();
    
    const logIdx = processedEmails.findIndex(e => e.id === refCode);
    if (logIdx !== -1) {
      processedEmails[logIdx].status = "Resolved";
      renderEmailLog();
    }
    
    confirmConflictBypass = originalOverride;
  };
};

// ==========================================
// FLOOR PLAN SNAPSHOT VIEW ENGINE
// ==========================================

let inspectedTableId = null;

function initSnapshotTimeDropdown() {
  const snapshotTimeSelect = document.getElementById("snapshot-time");
  if (!snapshotTimeSelect) return;
  
  const currentVal = snapshotTimeSelect.value;
  snapshotTimeSelect.innerHTML = "";

  const startMins = timeToMinutes(systemSettings.openTime);
  const endMins = timeToMinutes(systemSettings.closeTime || "22:00");

  for (let mins = startMins; mins <= endMins; mins += 15) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const hStr = h < 10 ? `0${h}` : h;
    const mStr = m < 10 ? `0${m}` : m;
    const time24 = `${hStr}:${mStr}`;
    const display = format12Hour(time24);
    
    snapshotTimeSelect.add(new Option(display, time24));
  }

  // Restore current value if it still exists, otherwise set to closest interval of current time
  if (currentVal && [...snapshotTimeSelect.options].some(o => o.value === currentVal)) {
    snapshotTimeSelect.value = currentVal;
  } else {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    let defaultMins = startMins;
    
    if (nowMins >= startMins && nowMins <= endMins) {
      defaultMins = Math.round(nowMins / 15) * 15;
      if (defaultMins < startMins) defaultMins = startMins;
      if (defaultMins > endMins) defaultMins = endMins;
    }
    
    const defH = Math.floor(defaultMins / 60);
    const defM = defaultMins % 60;
    const defHStr = defH < 10 ? `0${defH}` : defH;
    const defMStr = defM < 10 ? `0${defM}` : defM;
    snapshotTimeSelect.value = `${defHStr}:${defMStr}`;
  }
}

function isTableOccupiedAtTime(tableId, date, targetTime24) {
  const reservations = getReservations().filter(
    r => r.date === date && r.status !== "Cancelled"
  );
  const targetMins = timeToMinutes(targetTime24);
  
  // Check active bookings first
  for (const res of reservations) {
    const resStartMins = timeToMinutes(res.timeSlot);
    const resEndMins = resStartMins + BOOKING_DURATION_MINS;
    
    if (targetMins >= resStartMins && targetMins < resEndMins) {
      const resTableIds = res.tableId.split(",");
      if (resTableIds.includes(tableId)) {
        return { ...res, isUpcoming: false };
      }
    }
  }
  
  // Check upcoming bookings starting within 1h 45m (105 minutes) next
  for (const res of reservations) {
    const resStartMins = timeToMinutes(res.timeSlot);
    
    if (resStartMins >= targetMins && resStartMins < targetMins + 105) {
      const resTableIds = res.tableId.split(",");
      if (resTableIds.includes(tableId)) {
        return { ...res, isUpcoming: true };
      }
    }
  }
  
  return null;
}

function updateFloorPlanVisualState() {
  const viewDate = document.getElementById("view-date").value;
  const snapshotTimeSelect = document.getElementById("snapshot-time");
  if (!snapshotTimeSelect) return;
  const targetTimeStr = snapshotTimeSelect.value;
  
  const tableNodes = document.querySelectorAll(".table-node");
  tableNodes.forEach(node => {
    const tableId = node.getAttribute("data-table-id");
    const activeBooking = isTableOccupiedAtTime(tableId, viewDate, targetTimeStr);
    
    // Clear all state classes
    node.classList.remove("free", "occupied", "upcoming");
    
    if (activeBooking) {
      if (activeBooking.isUpcoming) {
        node.classList.add("upcoming");
      } else {
        node.classList.add("occupied");
      }
    } else {
      node.classList.add("free");
    }
  });
  
  if (inspectedTableId) {
    showTableInspectionDetails(inspectedTableId);
  }
}

function showTableInspectionDetails(tableId) {
  const infoPanel = document.getElementById("floorplan-table-info");
  if (!infoPanel) return;
  
  const viewDate = document.getElementById("view-date").value;
  const snapshotTimeSelect = document.getElementById("snapshot-time");
  if (!snapshotTimeSelect) return;
  const targetTimeStr = snapshotTimeSelect.value;
  
  const tableInfo = TABLES.find(t => t.id === tableId);
  if (!tableInfo) {
    infoPanel.innerHTML = "Select a table or bar counter in the floor plan to inspect its occupancy details at the chosen time slot.";
    return;
  }
  
  const activeBooking = isTableOccupiedAtTime(tableId, viewDate, targetTimeStr);
  
  document.querySelectorAll(".table-node").forEach(node => {
    if (node.getAttribute("data-table-id") === tableId) {
      node.classList.add("inspected");
    } else {
      node.classList.remove("inspected");
    }
  });
  
  if (activeBooking) {
    const start12 = format12Hour(activeBooking.timeSlot);
    const endMins = timeToMinutes(activeBooking.timeSlot) + BOOKING_DURATION_MINS;
    const endH = Math.floor(endMins / 60);
    const endM = endMins % 60;
    const endHStr = endH < 10 ? `0${endH}` : endH;
    const endMStr = endM < 10 ? `0${endM}` : endM;
    const end12 = format12Hour(`${endHStr}:${endMStr}`);
    
    if (activeBooking.isUpcoming) {
      const targetMins = timeToMinutes(targetTimeStr);
      const startMins = timeToMinutes(activeBooking.timeSlot);
      const diffMins = startMins - targetMins;
      
      infoPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.3rem;">
          <strong style="color: var(--color-accent); font-size: 0.95rem;">${tableInfo.name} - RESERVED SOON</strong>
          <span style="font-size: 0.75rem; background: rgba(242, 187, 5, 0.2); color: var(--color-accent); border: 1px solid rgba(242, 187, 5, 0.4); padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: bold;">Starts in ${diffMins} min</span>
        </div>
        <div style="margin-bottom: 0.2rem;">
          Guest: <strong style="color: var(--color-text-light);">${activeBooking.guestName}</strong> (${activeBooking.partySize} pax)
        </div>
        <div style="margin-bottom: 0.2rem; font-size: 0.8rem; color: var(--color-text-muted);">
          Time: <strong>${start12} - ${end12}</strong> | Phone: ${activeBooking.guestPhone}
        </div>
        ${activeBooking.specialRequests ? `<div style="font-size: 0.8rem; color: var(--color-accent); font-style: italic; margin-top: 0.2rem;">💬 "${activeBooking.specialRequests}"</div>` : ""}
      `;
    } else {
      infoPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.3rem;">
          <strong style="color: var(--color-primary-light); font-size: 0.95rem;">${tableInfo.name} - OCCUPIED</strong>
          <span style="font-size: 0.75rem; background: rgba(193, 18, 31, 0.2); color: #e74c3c; border: 1px solid rgba(193, 18, 31, 0.4); padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: bold;">Sitting</span>
        </div>
        <div style="margin-bottom: 0.2rem;">
          Guest: <strong style="color: var(--color-text-light);">${activeBooking.guestName}</strong> (${activeBooking.partySize} pax)
        </div>
        <div style="margin-bottom: 0.2rem; font-size: 0.8rem; color: var(--color-text-muted);">
          Time: <strong>${start12} - ${end12}</strong> | Phone: ${activeBooking.guestPhone}
        </div>
        ${activeBooking.specialRequests ? `<div style="font-size: 0.8rem; color: var(--color-accent); font-style: italic; margin-top: 0.2rem;">💬 "${activeBooking.specialRequests}"</div>` : ""}
      `;
    }
  } else {
    infoPanel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.3rem;">
        <strong style="color: #2ecc71; font-size: 0.95rem;">${tableInfo.name} - AVAILABLE</strong>
        <span style="font-size: 0.75rem; background: rgba(46, 204, 113, 0.15); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.3); padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: bold;">Free</span>
      </div>
      <div style="font-size: 0.85rem; color: var(--color-text-muted);">
        No active booking at ${format12Hour(targetTimeStr)}. (Capacity: ${tableInfo.minPax}-${tableInfo.maxPax} guests)
      </div>
    `;
  }
}

function initFloorPlanView() {
  const tableNodes = document.querySelectorAll(".table-node");
  tableNodes.forEach(node => {
    node.addEventListener("click", () => {
      const tableId = node.getAttribute("data-table-id");
      inspectedTableId = tableId;
      showTableInspectionDetails(tableId);
    });
  });
}

function getTablePriorityOrder(partySize) {
  if (partySize === 2) {
    return ["75", "73", "77", "71", "79", "81", "83", "87", "85", "95", "96"];
  }
  if (partySize === 1) {
    return ["87", "75", "73", "77", "71", "79", "81", "83", "85", "95", "96"];
  }
  return ["1", "4", "5", "6", "21", "22", "23", "24", "31", "32", "33", "34", "91", "92", "93", "95", "96"];
}

function runSeatingOptimizer(selectedDate) {
  const reservations = getReservations();
  const dayBookings = reservations.filter(r => r.date === selectedDate && r.status !== "Cancelled");
  
  if (dayBookings.length === 0) {
    alert("No active reservations to optimize for this date.");
    return;
  }
  
  const originalAssignments = {};
  dayBookings.forEach(b => {
    originalAssignments[b.id] = b.tableId;
  });
  
  const sortedBookings = [...dayBookings].sort((a, b) => {
    if (b.partySize !== a.partySize) {
      return b.partySize - a.partySize;
    }
    return a.timeSlot.localeCompare(b.timeSlot);
  });
  
  const assignedList = [];
  let reassignedCount = 0;
  let conflictCount = 0;
  const changesLog = [];
  
  const checkConflictInAssigned = (tableId, date, timeSlot) => {
    const targetMins = timeToMinutes(timeSlot);
    const targetTableIds = tableId.split(",");
    
    for (const res of assignedList) {
      const resMins = timeToMinutes(res.timeSlot);
      if (Math.abs(resMins - targetMins) < BOOKING_DURATION_MINS) {
        const resTableIds = res.tableId.split(",");
        const hasTableOverlap = resTableIds.some(id => targetTableIds.includes(id));
        if (hasTableOverlap) {
          return res;
        }
      }
    }
    return null;
  };
  
  for (const booking of sortedBookings) {
    const eligibleTables = TABLES.filter(t => booking.partySize >= t.minPax && booking.partySize <= t.maxPax);
    
    const priority = getTablePriorityOrder(booking.partySize);
    eligibleTables.sort((a, b) => {
      const indexA = priority.indexOf(a.id);
      const indexB = priority.indexOf(b.id);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
    
    let assignedTableId = null;
    
    for (const t of eligibleTables) {
      const overlap = checkConflictInAssigned(t.id, selectedDate, booking.timeSlot);
      if (!overlap) {
        assignedTableId = t.id;
        booking.hasConflict = false;
        break;
      }
    }
    
    if (!assignedTableId) {
      if (eligibleTables.length > 0) {
        assignedTableId = eligibleTables[0].id;
      } else {
        assignedTableId = "1";
      }
      booking.hasConflict = true;
      conflictCount++;
    }
    
    booking.tableId = assignedTableId;
    assignedList.push(booking);
    
    const prevTable = originalAssignments[booking.id];
    if (prevTable !== assignedTableId) {
      reassignedCount++;
      changesLog.push({
        guestName: booking.guestName,
        partySize: booking.partySize,
        timeSlot: booking.timeSlot,
        oldTable: formatTableDisplay(prevTable),
        newTable: formatTableDisplay(assignedTableId),
        isConflicted: booking.hasConflict
      });
    }
  }
  
  reservations.forEach(r => {
    if (r.date === selectedDate && r.status !== "Cancelled") {
      const opt = assignedList.find(a => a.id === r.id);
      if (opt) {
        r.tableId = opt.tableId;
        r.hasConflict = opt.hasConflict;
      }
    }
  });
  
  saveAllReservations(reservations);
  
  renderBookingsList();
  updateFloorPlanVisualState();
  
  document.getElementById("opt-report-date").textContent = new Date(selectedDate).toLocaleDateString("en-NZ", {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'
  });
  document.getElementById("opt-stat-total").textContent = dayBookings.length;
  document.getElementById("opt-stat-moved").textContent = reassignedCount;
  document.getElementById("opt-stat-conflicts").textContent = conflictCount;
  
  const logContainer = document.getElementById("optimizer-changes-log");
  if (changesLog.length === 0) {
    logContainer.innerHTML = `<p style="text-align: center; font-style: italic; margin: 1rem 0; color: var(--color-text-muted);">Seating plan was already perfectly optimized! No changes required.</p>`;
  } else {
    logContainer.innerHTML = changesLog.map(change => {
      const conflictBadge = change.isConflicted ? `<span class="badge-conflict" style="font-size: 0.65rem; padding: 0.05rem 0.2rem; margin-left: 0.4rem;">⚠️ Overlap</span>` : "";
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
          <div>
            <strong style="color: #fff;">${change.guestName}</strong> (${change.partySize} pax) at ${format12Hour(change.timeSlot)}
            ${conflictBadge}
          </div>
          <div style="font-family: monospace; color: var(--color-accent);">
            ${change.oldTable} ➔ ${change.newTable}
          </div>
        </div>
      `;
    }).join("");
  }
  
  document.getElementById("optimizer-modal-backdrop").classList.add("active");
}
