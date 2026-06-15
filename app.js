/* C:\Users\callu\Documents\antigravity\focused-shannon\app.js */

// Global Constant Table Definitions
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
  
  // Yakitori Grill Counter (A) Seats
  { id: "71", type: "seat", minPax: 1, maxPax: 1, name: "Yakitori Grill Stool 71", pairId: "72", section: "Grill Counter" },
  { id: "72", type: "seat", minPax: 1, maxPax: 1, name: "Yakitori Grill Stool 72", pairId: "71", section: "Grill Counter" },
  { id: "73", type: "seat", minPax: 1, maxPax: 1, name: "Yakitori Grill Stool 73", pairId: "74", section: "Grill Counter" },
  { id: "74", type: "seat", minPax: 1, maxPax: 1, name: "Yakitori Grill Stool 74", pairId: "73", section: "Grill Counter" },
  { id: "75", type: "seat", minPax: 1, maxPax: 1, name: "Yakitori Grill Stool 75", pairId: "76", section: "Grill Counter" },
  { id: "76", type: "seat", minPax: 1, maxPax: 1, name: "Yakitori Grill Stool 76", pairId: "75", section: "Grill Counter" },
  { id: "77", type: "seat", minPax: 1, maxPax: 1, name: "Yakitori Grill Stool 77", pairId: "78", section: "Grill Counter" },
  { id: "78", type: "seat", minPax: 1, maxPax: 1, name: "Yakitori Grill Stool 78", pairId: "77", section: "Grill Counter" },
  { id: "79", type: "seat", minPax: 1, maxPax: 1, name: "Yakitori Grill Stool 79", pairId: "80", section: "Grill Counter" },
  { id: "80", type: "seat", minPax: 1, maxPax: 1, name: "Yakitori Grill Stool 80", pairId: "79", section: "Grill Counter" },
  
  // Sake Bar Counter (B) Seats
  { id: "81", type: "seat", minPax: 1, maxPax: 1, name: "Sake Bar Stool 81", pairId: "82", section: "Sake Bar" },
  { id: "82", type: "seat", minPax: 1, maxPax: 1, name: "Sake Bar Stool 82", pairId: "81", section: "Sake Bar" },
  { id: "83", type: "seat", minPax: 1, maxPax: 1, name: "Sake Bar Stool 83", pairId: "84", section: "Sake Bar" },
  { id: "84", type: "seat", minPax: 1, maxPax: 1, name: "Sake Bar Stool 84", pairId: "83", section: "Sake Bar" },
  { id: "85", type: "seat", minPax: 1, maxPax: 1, name: "Sake Bar Stool 85", pairId: "86", section: "Sake Bar" },
  { id: "86", type: "seat", minPax: 1, maxPax: 1, name: "Sake Bar Stool 86", pairId: "85", section: "Sake Bar" },
  { id: "87", type: "seat", minPax: 1, maxPax: 1, name: "Sake Bar Stool 87", pairId: null, section: "Sake Bar" },
  
  // Courtenay Balcony (Outside)
  { id: "91", type: "outdoor", minPax: 1, maxPax: 2, name: "Balcony Table 91", section: "Balcony" },
  { id: "92", type: "outdoor", minPax: 1, maxPax: 2, name: "Balcony Table 92", section: "Balcony" },
  { id: "93", type: "outdoor", minPax: 1, maxPax: 2, name: "Balcony Table 93", section: "Balcony" },
  
  // Tatami Corners / Booths
  { id: "95", type: "corner", minPax: 1, maxPax: 2, name: "Tatami Booth 95", section: "Tatami Booths" },
  { id: "96", type: "corner", minPax: 1, maxPax: 2, name: "Tatami Booth 96", section: "Tatami Booths" }
];

// Configuration Defaults (Kazu opens at 5:00 PM for dinner)
const DEFAULT_SETTINGS = {
  email: "bookings@kazu.co.nz",
  openTime: "17:00",
  closeTime: "22:00" // Not directly used for booking limits, governed by weekday rules
};

// System settings cache
let systemSettings = { ...DEFAULT_SETTINGS };

// Temporary variables for conflict bypass
let pendingOverrideBooking = null;

// Simulated Email logs
let processedEmails = [];

// Initialize Page Elements
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  initFormTimeDropdowns();
  initTableAssignmentDropdowns();
  
  // Set default dates
  const todayStr = new Date().toISOString().split("T")[0];
  document.getElementById("manual-date").value = todayStr;
  document.getElementById("manual-date").min = todayStr;
  document.getElementById("view-date").value = todayStr;
  
  // Re-generate time slots list when date picker value changes
  document.getElementById("manual-date").addEventListener("change", () => {
    initFormTimeDropdowns();
  });
  
  // Initial renders
  renderBookingsList();
  renderEmailLog();
  
  // Bind Event Listeners
  document.getElementById("phone-booking-form").addEventListener("submit", handleManualSubmit);
  document.getElementById("view-date").addEventListener("change", renderBookingsList);
  document.getElementById("btn-print-sheet").addEventListener("click", () => window.print());
  
  // Settings Panel Bindings
  document.getElementById("btn-toggle-settings").addEventListener("click", openSettingsDrawer);
  document.getElementById("btn-close-settings").addEventListener("click", closeSettingsDrawer);
  document.getElementById("settings-form").addEventListener("submit", saveSettings);
  document.getElementById("btn-reset-settings").addEventListener("click", resetSettings);
  
  // Conflict Dialog Bindings
  document.getElementById("btn-modal-cancel").addEventListener("click", cancelConflictBypass);
  document.getElementById("btn-modal-override").addEventListener("click", confirmConflictBypass);
  
  // Email Simulator Bindings
  document.getElementById("email-preset").addEventListener("change", handleEmailPresetChange);
  document.getElementById("btn-simulate-email").addEventListener("click", handleEmailSimulation);
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
  if (!match) return "18:00"; // fallback
  
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
    // First run initialization, prompt settings drawer to open
    localStorage.setItem("kazu_system_settings", JSON.stringify(DEFAULT_SETTINGS));
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
  
  systemSettings.email = document.getElementById("settings-email").value.trim() || DEFAULT_SETTINGS.email;
  systemSettings.openTime = document.getElementById("settings-open-time").value;
  
  localStorage.setItem("kazu_system_settings", JSON.stringify(systemSettings));
  
  document.getElementById("active-email-display").textContent = `(Monitoring: ${systemSettings.email})`;
  closeSettingsDrawer();
  
  // Re-init form times based on new bounds
  initFormTimeDropdowns();
  alert("Settings saved successfully!");
  renderBookingsList();
}

function resetSettings() {
  if (confirm("Reset settings to default? (Opening Hours start at 5:00 PM)")) {
    systemSettings = { ...DEFAULT_SETTINGS };
    localStorage.setItem("kazu_system_settings", JSON.stringify(systemSettings));
    
    document.getElementById("settings-email").value = systemSettings.email;
    document.getElementById("settings-open-time").value = systemSettings.openTime;
    
    document.getElementById("active-email-display").textContent = `(Monitoring: ${systemSettings.email})`;
    initFormTimeDropdowns();
    renderBookingsList();
  }
}

// Populate Time dropdowns bounded by opening hours and weekday/weekend rules
function initFormTimeDropdowns() {
  const manualDate = document.getElementById("manual-date").value;
  const manualTimeSelect = document.getElementById("manual-time");
  const settingsOpen = document.getElementById("settings-open-time");
  
  // Generate all 24h slots
  const allSlots = [];
  for (let h = 0; h < 24; h++) {
    const hStr = h < 10 ? `0${h}` : h;
    allSlots.push(`${hStr}:00`, `${hStr}:30`);
  }
  
  // Populate settings options once (unbounded)
  if (settingsOpen.children.length === 0) {
    allSlots.forEach(slot => {
      const opt = new Option(format12Hour(slot), slot);
      settingsOpen.add(opt);
    });
    // Hide settings-close-time parent form group if it exists (since limits are dynamic)
    const settingsClose = document.getElementById("settings-close-time");
    if (settingsClose && settingsClose.parentElement) {
      settingsClose.parentElement.style.display = "none";
    }
  }
  
  settingsOpen.value = systemSettings.openTime;
  
  // Filter manual time selection by Kazu rules
  manualTimeSelect.innerHTML = "";
  
  if (!manualDate) return;
  
  // Check day of week
  const dateObj = new Date(manualDate);
  const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 1 is Monday ... 5 is Friday, 6 is Saturday
  
  // Weekdays: Sunday (0) to Thursday (4). Weekends: Friday (5) & Saturday (6)
  const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6);
  const maxTimeStr = isWeekend ? "20:30" : "20:00"; // Fri-Sat bookings end at 8:30 PM, Sun-Thu at 8:00 PM
  
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
  const manualTable = document.getElementById("manual-table");
  manualTable.innerHTML = "";
  
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
      if (t.type === "seat" && t.pairId) {
        displayName += ` (Paired with Stool ${t.pairId})`;
      } else if (t.type === "table") {
        displayName += ` (Fits ${t.minPax}-${t.maxPax} pax)`;
      } else if (t.type === "sharing") {
        displayName += ` (Fits 1-3 pax)`;
      } else {
        displayName += ` (Fits 1-2 pax)`;
      }
      optGroup.appendChild(new Option(displayName, t.id));
    });
    manualTable.appendChild(optGroup);
  }
}

// Toggle drawer
function openSettingsDrawer() {
  document.getElementById("settings-drawer").classList.add("active");
}
function closeSettingsDrawer() {
  document.getElementById("settings-drawer").classList.remove("active");
}

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
        return res; // conflict found
      }
    }
  }
  return null;
}

// Handle Manual Form Submission
function handleManualSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById("manual-name").value.trim();
  const phone = document.getElementById("manual-phone").value.trim();
  const date = document.getElementById("manual-date").value;
  const timeSlot = document.getElementById("manual-time").value;
  const partySize = parseInt(document.getElementById("manual-pax").value, 10);
  const rawTableId = document.getElementById("manual-table").value;
  const notes = document.getElementById("manual-notes").value.trim();
  
  // Double check time validity against day bounds in case form states got out of sync
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
  
  let finalTableId = rawTableId;
  const selectedTableInfo = TABLES.find(t => t.id === rawTableId);
  if (partySize === 2 && selectedTableInfo.type === "seat" && selectedTableInfo.pairId) {
    finalTableId = `${rawTableId},${selectedTableInfo.pairId}`;
  }
  
  // Capacity check
  if (selectedTableInfo.type !== "seat") {
    if (partySize < selectedTableInfo.minPax || partySize > selectedTableInfo.maxPax) {
      alert(`Capacity mismatch: ${selectedTableInfo.name} only accommodates ${selectedTableInfo.minPax} to ${selectedTableInfo.maxPax} guests. Please assign a suitable table.`);
      return;
    }
  }
  
  const refCode = `KAZU-${Math.floor(1000 + Math.random() * 9000)}`;
  const bookingObj = {
    id: refCode,
    guestName: name,
    guestPhone: phone,
    date: date,
    timeSlot: timeSlot,
    partySize: partySize,
    tableId: finalTableId,
    specialRequests: notes,
    status: "Confirmed",
    hasConflict: false
  };
  
  const conflictBooking = checkConflict(finalTableId, date, timeSlot);
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
}

// Reset manual form
function resetManualForm() {
  document.getElementById("manual-name").value = "";
  document.getElementById("manual-phone").value = "";
  document.getElementById("manual-notes").value = "";
  document.getElementById("manual-pax").value = "2";
  document.getElementById("manual-date").value = new Date().toISOString().split("T")[0];
  initFormTimeDropdowns(); // refresh dropdown options
}

// Trigger Conflict Alert Modal
function triggerConflictModal(newBooking, existingBooking) {
  pendingOverrideBooking = newBooking;
  
  const newText = `Ref: Pending | <strong>${newBooking.guestName}</strong> at <strong>${format12Hour(newBooking.timeSlot)}</strong> (Table/Seat: ${formatTableDisplay(newBooking.tableId)})`;
  const existingText = `Ref: ${existingBooking.id} | <strong>${existingBooking.guestName}</strong> at <strong>${format12Hour(existingBooking.timeSlot)}</strong> (Table/Seat: ${formatTableDisplay(existingBooking.tableId)})`;
  
  document.getElementById("conflict-new-details").innerHTML = newText;
  document.getElementById("conflict-existing-details").innerHTML = existingText;
  
  document.getElementById("conflict-modal-backdrop").classList.add("active");
}

function cancelConflictBypass() {
  pendingOverrideBooking = null;
  document.getElementById("conflict-modal-backdrop").classList.remove("active");
}

function confirmConflictBypass() {
  if (pendingOverrideBooking) {
    pendingOverrideBooking.hasConflict = true;
    const current = getReservations();
    current.push(pendingOverrideBooking);
    saveAllReservations(current);
    
    alert(`Reservation overridden & saved (Ref: ${pendingOverrideBooking.id})`);
    pendingOverrideBooking = null;
    
    document.getElementById("conflict-modal-backdrop").classList.remove("active");
    resetManualForm();
    renderBookingsList();
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
  
  // Stats
  const totalCovers = activeBookings.reduce((sum, r) => sum + r.partySize, 0);
  const occupiedTables = new Set();
  activeBookings.forEach(r => r.tableId.split(",").forEach(id => occupiedTables.add(id)));
  const occupancyPercentage = Math.round((occupiedTables.size / TABLES.length) * 100) || 0;
  
  document.getElementById("stat-total").textContent = activeBookings.length;
  document.getElementById("stat-guests").textContent = totalCovers;
  document.getElementById("stat-occupancy").textContent = `${occupancyPercentage}%`;
  
  // Sort Chronologically
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
    const info = TABLES.find(t => t.id === ids[0]);
    let label = "Counter Seat";
    if (info) label = info.id.startsWith("7") ? "Yakitori Grill Counter" : "Sake Bar Counter";
    return `Stools ${ids.join(" & ")} (${label})`;
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
  }
};

// ==========================================
// MOCK EMAIL INTEGRATION ENGINE
// ==========================================

// Predefined simulation templates (Updated dates/times matching the Kazu schedule rules)
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

// Handle Preset Dropdown Changes
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

// Handle simulation execution
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
  
  // Parser Engine
  const parsed = parseEmailBody(rawText);
  if (!parsed) {
    alert("Error: Could not parse booking details from the email text. Check formatting.");
    return;
  }
  
  // Validate Time Slot against business hours
  const d = new Date(parsed.date);
  const dayOfWeek = d.getDay();
  const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6);
  const maxTimeStr = isWeekend ? "20:30" : "20:00";
  const startMins = timeToMinutes(systemSettings.openTime);
  const endMins = timeToMinutes(maxTimeStr);
  const targetMins = timeToMinutes(parsed.timeSlot);
  
  const timeValid = (targetMins >= startMins && targetMins <= endMins);
  
  // Attempt to allocate table
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
    // Booking outside allowed hours! Force manual review
    emailLogObj.status = "Manual Review";
    emailLogObj.booking.hasConflict = true;
    emailLogObj.booking.specialRequests += ` [ALERT: Past Allowed Hours (${format12Hour(maxTimeStr)})]`;
    processedEmails.push(emailLogObj);
    alert(`⚠️ Email Parsed! The requested time ${format12Hour(parsed.timeSlot)} is outside allowed hours for this date (Limits: ${format12Hour(systemSettings.openTime)} - ${format12Hour(maxTimeStr)}). Surfaced in log for review.`);
  } else if (allocatedTable && allocatedTable.isConflicted) {
    // Overlap exists! Add to review queue
    emailLogObj.status = "Manual Review";
    emailLogObj.booking.hasConflict = true;
    processedEmails.push(emailLogObj);
    alert(`⚠️ Email Parsed! A booking conflict was detected for ${parsed.name} at ${format12Hour(parsed.timeSlot)}. Surfacing in log for review.`);
  } else if (!allocatedTable) {
    // No suitable table size or all fully occupied
    emailLogObj.status = "Manual Review";
    emailLogObj.booking.hasConflict = true;
    processedEmails.push(emailLogObj);
    alert(`⚠️ Email Parsed! No clean tables available for party of ${parsed.partySize} at ${format12Hour(parsed.timeSlot)}. Surfaced in log for manual review.`);
  } else {
    // Clean booking: Auto-Save
    emailLogObj.status = "Auto-Saved";
    const current = getReservations();
    current.push(bookingObj);
    saveAllReservations(current);
    processedEmails.push(emailLogObj);
    
    alert(`✓ Email Auto-Imported! Reservation saved successfully for ${parsed.name} (Table ${allocatedTable.display}).`);
  }
  
  // Refresh Lists
  renderEmailLog();
  renderBookingsList();
  
  // Reset simulation selectors
  document.getElementById("email-preset").value = "0";
  document.getElementById("email-custom-text").value = "";
  document.getElementById("custom-email-wrapper").style.display = "none";
}

// Helper: Auto allocate a table based on rules
function autoAllocateTable(partySize, date, timeSlot) {
  const eligibleTables = TABLES.filter(t => {
    if (t.type === "seat" && partySize <= 2) {
      return true;
    }
    return partySize >= t.minPax && partySize <= t.maxPax;
  });
  
  if (eligibleTables.length === 0) return null;
  
  for (const t of eligibleTables) {
    let checkId = t.id;
    if (partySize === 2 && t.type === "seat" && t.pairId) {
      checkId = `${t.id},${t.pairId}`;
    }
    
    const overlap = checkConflict(checkId, date, timeSlot);
    if (!overlap) {
      return { id: checkId, display: formatTableDisplay(checkId), isConflicted: false };
    }
  }
  
  const firstTable = eligibleTables[0];
  let checkId = firstTable.id;
  if (partySize === 2 && firstTable.type === "seat" && firstTable.pairId) {
    checkId = `${firstTable.id},${firstTable.pairId}`;
  }
  return { id: checkId, display: formatTableDisplay(checkId), isConflicted: true };
}

// Regex parsing engine for simulated email bodies
function parseEmailBody(bodyText) {
  try {
    const lines = bodyText.split("\n");
    let name = "";
    let phone = "";
    let date = "";
    let timeSlot = "";
    let partySize = 2; // default
    
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
