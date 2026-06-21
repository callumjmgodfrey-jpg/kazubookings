/* C:\Users\callu\Documents\antigravity\focused-shannon\app.js */

// Global Table Definitions (mutable to allow live capacity configurator)
let TABLES = [
  { id: "1", type: "table", minPax: 5, maxPax: 8, name: "Table 1 (Big Group Table)", section: "Dining Room" },
  { id: "4", type: "table", minPax: 3, maxPax: 4, name: "Table 4 (Dining Table)", section: "Dining Room" },
  { id: "5", type: "table", minPax: 3, maxPax: 4, name: "Table 5 (Dining Table)", section: "Dining Room" },
  { id: "6", type: "table", minPax: 3, maxPax: 4, name: "Table 6 (Dining Table)", section: "Dining Room" },
  
  { id: "21", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 2 - Corner 21", section: "Sharing Table 2" },
  { id: "22", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 2 - Corner 22", section: "Sharing Table 2" },
  { id: "23", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 2 - Corner 23", section: "Sharing Table 2" },
  { id: "24", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 2 - Corner 24", section: "Sharing Table 2" },
  { id: "21,22,23,24", type: "table", minPax: 5, maxPax: 10, name: "Sharing Table 2 (Combined - Max 10 pax)", section: "Sharing Table 2" },
  
  { id: "31", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 3 - Corner 31", section: "Sharing Table 3" },
  { id: "32", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 3 - Corner 32", section: "Sharing Table 3" },
  { id: "33", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 3 - Corner 33", section: "Sharing Table 3" },
  { id: "34", type: "sharing", minPax: 1, maxPax: 3, name: "Sharing Table 3 - Corner 34", section: "Sharing Table 3" },
  { id: "31,32,33,34", type: "table", minPax: 5, maxPax: 10, name: "Sharing Table 3 (Combined - Max 10 pax)", section: "Sharing Table 3" },
  
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
  closeTime: "22:00",
  firebaseEnabled: false,
  firebaseConfig: {
    apiKey: "",
    projectId: "",
    appId: "",
    authDomain: ""
  }
};

// Temporary variables for conflict bypass
let pendingOverrideBooking = null;

// Initialize Page Elements
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  initFormTimeDropdowns();
  initTableAssignmentDropdowns();
  
  // Populate date dropdowns
  initDateDropdowns();
  
  // Set default dates
  const todayStr = new Date().toISOString().split("T")[0];
  manualDateInput.value = todayStr;
  document.getElementById("view-date").value = todayStr;
  
  // Re-generate time slots list when date picker value changes
  manualDateInput.addEventListener("change", () => {
    initFormTimeDropdowns();
    updateTableDropdownAvailability();
    suggestBestTable();
  });
  
  // Initial renders
  renderBookingsList();
  renderEmailLog();
  
  // Initialize floor plan snapshot dropdown and events
  initSnapshotTimeDropdown();
  initFloorPlanView();
  
  // Update availability and suggest best table on load
  updateTableDropdownAvailability();
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
  
  const btnSeedData = document.getElementById("btn-seed-data");
  if (btnSeedData) {
    btnSeedData.addEventListener("click", seedTomorrowReservations);
  }
  
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
  manualPaxSelect.addEventListener("change", () => {
    updateTableDropdownAvailability();
    suggestBestTable();
  });
  manualTimeSelect.addEventListener("change", () => {
    updateTableDropdownAvailability();
    suggestBestTable();
  });

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
  
  // ==========================================
  // NEW FEATURE BINDINGS
  // ==========================================
  
  // Left Column Tab Switcher
  const btnTabBooking = document.getElementById("btn-tab-booking");
  const btnTabWaitlist = document.getElementById("btn-tab-waitlist");
  const bookingTabContent = document.getElementById("booking-tab-content");
  const waitlistTabContent = document.getElementById("waitlist-tab-content");
  
  if (btnTabBooking && btnTabWaitlist) {
    btnTabBooking.addEventListener("click", () => {
      btnTabBooking.classList.add("active");
      btnTabWaitlist.classList.remove("active");
      bookingTabContent.style.display = "block";
      waitlistTabContent.style.display = "none";
    });
    
    btnTabWaitlist.addEventListener("click", () => {
      btnTabWaitlist.classList.add("active");
      btnTabBooking.classList.remove("active");
      bookingTabContent.style.display = "none";
      waitlistTabContent.style.display = "block";
      renderWaitlistQueue();
    });
  }
  
  // Waitlist Form submit
  const waitlistForm = document.getElementById("waitlist-form");
  if (waitlistForm) {
    waitlistForm.addEventListener("submit", handleWaitlistSubmit);
  }
  
  // Firebase toggle container helper
  const fbEnableCheckbox = document.getElementById("settings-firebase-enable");
  if (fbEnableCheckbox) {
    fbEnableCheckbox.addEventListener("change", () => {
      document.getElementById("firebase-fields-container").style.display = fbEnableCheckbox.checked ? "flex" : "none";
    });
  }
  
  // Table Configuration Modal Trigger
  const btnOpenTableConfig = document.getElementById("btn-open-table-config");
  const btnCloseTableConfig = document.getElementById("btn-close-table-config");
  const btnSaveTableConfig = document.getElementById("btn-save-table-config");
  const btnResetTableConfig = document.getElementById("btn-reset-table-config");
  const tableConfigModal = document.getElementById("table-config-modal-backdrop");
  
  if (btnOpenTableConfig) {
    btnOpenTableConfig.addEventListener("click", () => {
      closeSettingsDrawer();
      renderTableConfigTable();
      tableConfigModal.classList.add("active");
    });
  }
  if (btnCloseTableConfig) {
    btnCloseTableConfig.addEventListener("click", () => {
      tableConfigModal.classList.remove("active");
    });
  }
  if (btnSaveTableConfig) {
    btnSaveTableConfig.addEventListener("click", saveTableConfig);
  }
  if (btnResetTableConfig) {
    btnResetTableConfig.addEventListener("click", resetTableConfig);
  }
  
  // Analytics Dashboard Modal Trigger
  const btnViewAnalytics = document.getElementById("btn-view-analytics");
  const btnCloseAnalytics = document.getElementById("btn-close-analytics");
  const analyticsModal = document.getElementById("analytics-modal-backdrop");
  
  if (btnViewAnalytics) {
    btnViewAnalytics.addEventListener("click", () => {
      generateAnalyticsReport();
      analyticsModal.classList.add("active");
    });
  }
  if (btnCloseAnalytics) {
    btnCloseAnalytics.addEventListener("click", () => {
      analyticsModal.classList.remove("active");
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
  
  // Try initializing Firebase on load if enabled
  if (systemSettings.firebaseEnabled && systemSettings.firebaseConfig && systemSettings.firebaseConfig.projectId) {
    initFirebaseSync();
  }
  
  // Load table configuration overrides
  loadTablesConfig();
}

function populateSettingsUI() {
  document.getElementById("settings-email").value = systemSettings.email || "";
  document.getElementById("settings-open-time").value = systemSettings.openTime || "17:00";
  
  const fbEnable = !!systemSettings.firebaseEnabled;
  document.getElementById("settings-firebase-enable").checked = fbEnable;
  document.getElementById("firebase-fields-container").style.display = fbEnable ? "flex" : "none";
  
  const config = systemSettings.firebaseConfig || {};
  document.getElementById("settings-firebase-apiKey").value = config.apiKey || "";
  document.getElementById("settings-firebase-projectId").value = config.projectId || "";
  document.getElementById("settings-firebase-appId").value = config.appId || "";
  document.getElementById("settings-firebase-authDomain").value = config.authDomain || "";
}

// Save system configurations
function saveSettings(e) {
  e.preventDefault();
  
  systemSettings.email = document.getElementById("settings-email").value.trim() || "bookings@kazu.co.nz";
  systemSettings.openTime = document.getElementById("settings-open-time").value;
  
  const fbEnable = document.getElementById("settings-firebase-enable").checked;
  systemSettings.firebaseEnabled = fbEnable;
  
  systemSettings.firebaseConfig = {
    apiKey: document.getElementById("settings-firebase-apiKey").value.trim(),
    projectId: document.getElementById("settings-firebase-projectId").value.trim(),
    appId: document.getElementById("settings-firebase-appId").value.trim(),
    authDomain: document.getElementById("settings-firebase-authDomain").value.trim()
  };
  
  localStorage.setItem("kazu_system_settings", JSON.stringify(systemSettings));
  
  document.getElementById("active-email-display").textContent = `(Monitoring: ${systemSettings.email})`;
  closeSettingsDrawer();
  
  initFormTimeDropdowns();
  
  if (fbEnable && systemSettings.firebaseConfig.projectId) {
    initFirebaseSync();
  } else {
    alert("Settings saved successfully!");
  }
  
  renderBookingsList();
  initSnapshotTimeDropdown();
  updateFloorPlanVisualState();
}

function resetSettings() {
  if (confirm("Reset settings to default? (Opening Hours start at 5:00 PM)")) {
    systemSettings = {
      email: "bookings@kazu.co.nz",
      openTime: "17:00",
      closeTime: "22:00",
      firebaseEnabled: false,
      firebaseConfig: {
        apiKey: "",
        projectId: "",
        appId: "",
        authDomain: ""
      }
    };
    localStorage.setItem("kazu_system_settings", JSON.stringify(systemSettings));
    
    populateSettingsUI();
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
function openSettingsDrawer() { 
  populateSettingsUI();
  settingsDrawer.classList.add("active"); 
}
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
  
  // If this booking came from a waitlist entry, mark it as Seated
  if (activeSeatingWaitlistId) {
    markWaitlistAsSeated(activeSeatingWaitlistId);
    activeSeatingWaitlistId = null;
  }
  
  resetManualForm();
  renderBookingsList();
  updateFloorPlanVisualState();
  updateTableDropdownAvailability();
}

// Reset manual form
function resetManualForm() {
  manualNameInput.value = "";
  manualPhoneInput.value = "";
  manualNotesInput.value = "";
  manualPaxSelect.value = "2";
  manualDateInput.value = new Date().toISOString().split("T")[0];
  initFormTimeDropdowns();
  updateTableDropdownAvailability();
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

// Global active waitlist seating session tracker
let activeSeatingWaitlistId = null;

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
    
    // If this booking came from a waitlist entry, mark it as Seated
    if (activeSeatingWaitlistId) {
      markWaitlistAsSeated(activeSeatingWaitlistId);
      activeSeatingWaitlistId = null;
    }
    
    pendingOverrideBooking = null;
    
    conflictModalBackdrop.classList.remove("active");
    resetManualForm();
    renderBookingsList();
    updateFloorPlanVisualState();
    updateTableDropdownAvailability();
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
    
    // Set status classes for styling/printing selection
    tr.className = `status-${res.status.toLowerCase().replace(/\s+/g, '-')}`;
    if (res.hasConflict && res.status !== "Cancelled") {
      tr.classList.add("row-conflict");
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
    
    const timeDetails = getSeatingTimeDetails(res);
    const lastOrder12 = format12Hour(timeDetails.lastOrderTime);

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
        <div style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600;">Last Order: ${lastOrder12}</div>
        <div class="desktop-only-duration" style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: normal;">Duration: up to 2 hours</div>
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
  const exactMatch = TABLES.find(t => t.id === tableId);
  if (exactMatch) return exactMatch.name;
  
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
    updateTableDropdownAvailability();
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

function updateTableDropdownAvailability() {
  const date = manualDateInput.value;
  const time = manualTimeSelect.value;
  if (!date || !time) return;
  
  const options = manualTableSelect.options;
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    const tableId = opt.value;
    const tableInfo = TABLES.find(t => t.id === tableId);
    if (!tableInfo) continue;
    
    const overlap = checkConflict(tableId, date, time);
    if (overlap) {
      opt.disabled = true;
      if (!opt.text.endsWith(" (Occupied)")) {
        opt.text = `${tableInfo.name} (Occupied)`;
      }
    } else {
      opt.disabled = false;
      opt.text = tableInfo.name;
    }
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
    const timeDetails = getSeatingTimeDetails(activeBooking);
    const start12 = format12Hour(activeBooking.timeSlot);
    const end12 = format12Hour(timeDetails.endTime);
    const lastOrder12 = format12Hour(timeDetails.lastOrderTime);
    
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
          Time: <strong>${start12} - ${end12}</strong> | Last Order: <strong style="color: var(--color-accent);">${lastOrder12}</strong>
        </div>
        <div style="margin-bottom: 0.2rem; font-size: 0.8rem; color: var(--color-text-muted);">
          Phone: ${activeBooking.guestPhone}
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
          Time: <strong>${start12} - ${end12}</strong> | Last Order: <strong style="color: var(--color-accent);">${lastOrder12}</strong>
        </div>
        <div style="margin-bottom: 0.2rem; font-size: 0.8rem; color: var(--color-text-muted);">
          Phone: ${activeBooking.guestPhone}
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
  // Filter tables that can accommodate this party size
  const eligible = TABLES.filter(t => partySize >= t.minPax && partySize <= t.maxPax);
  
  // Sort by priority rank (t.priority - if defined, else default values)
  eligible.sort((a, b) => {
    const pA = a.priority !== undefined ? a.priority : getDefaultTablePriority(a.id, partySize);
    const pB = b.priority !== undefined ? b.priority : getDefaultTablePriority(b.id, partySize);
    return pA - pB;
  });
  
  return eligible.map(t => t.id);
}

function getDefaultTablePriority(tableId, partySize) {
  const originalOrder = getOriginalPriorityList(partySize);
  const idx = originalOrder.indexOf(tableId);
  return idx !== -1 ? idx + 1 : 999;
}

function getOriginalPriorityList(partySize) {
  if (partySize === 2) {
    return ["75", "73", "77", "71", "79", "81", "83", "87", "85", "95", "96"];
  }
  if (partySize === 1) {
    return ["87", "75", "73", "77", "71", "79", "81", "83", "85", "95", "96"];
  }
  if (partySize >= 3 && partySize <= 4) {
    return ["4", "5", "6", "21", "22", "23", "24", "31", "32", "33", "34", "91", "92", "93", "95", "96"];
  }
  if (partySize >= 5 && partySize <= 8) {
    return ["1", "21,22,23,24", "31,32,33,34", "4", "5", "6"];
  }
  if (partySize >= 9 && partySize <= 10) {
    return ["21,22,23,24", "31,32,33,34"];
  }
  return ["1", "21,22,23,24", "31,32,33,34", "4", "5", "6", "21", "22", "23", "24", "31", "32", "33", "34", "91", "92", "93", "95", "96"];
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
  updateTableDropdownAvailability();
  
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

function seedTomorrowReservations() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  
  const mockBookings = [
    {
      id: `KAZU-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: "Kenji Sato",
      guestPhone: "027 493 2847",
      date: tomorrowStr,
      timeSlot: "17:30",
      partySize: 2,
      tableId: "75",
      specialRequests: "Preferred Sake selection.",
      status: "Confirmed",
      hasConflict: false
    },
    {
      id: `KAZU-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: "Yuki Matsuura",
      guestPhone: "022 431 8765",
      date: tomorrowStr,
      timeSlot: "18:00",
      partySize: 2,
      tableId: "75",
      specialRequests: "Regular guest.",
      status: "Confirmed",
      hasConflict: true
    },
    {
      id: `KAZU-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: "Satomi Takahashi",
      guestPhone: "021 987 6543",
      date: tomorrowStr,
      timeSlot: "19:00",
      partySize: 2,
      tableId: "75",
      specialRequests: "Birthday celebration.",
      status: "Confirmed",
      hasConflict: true
    },
    {
      id: `KAZU-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: "John Doe Group",
      guestPhone: "027 555 1234",
      date: tomorrowStr,
      timeSlot: "18:30",
      partySize: 8,
      tableId: "1",
      specialRequests: "Big group table.",
      status: "Confirmed",
      hasConflict: false
    },
    {
      id: `KAZU-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: "Jane Smith Family",
      guestPhone: "022 555 5678",
      date: tomorrowStr,
      timeSlot: "18:00",
      partySize: 4,
      tableId: "4",
      specialRequests: "High chair needed.",
      status: "Confirmed",
      hasConflict: false
    },
    {
      id: `KAZU-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: "Hiroshi Tanaka",
      guestPhone: "021 555 9999",
      date: tomorrowStr,
      timeSlot: "19:15",
      partySize: 2,
      tableId: "73",
      specialRequests: "Near the grill.",
      status: "Confirmed",
      hasConflict: false
    },
    {
      id: `KAZU-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: "Alice Cooper",
      guestPhone: "027 555 8888",
      date: tomorrowStr,
      timeSlot: "17:00",
      partySize: 3,
      tableId: "4",
      specialRequests: "Window seat preferred.",
      status: "Confirmed",
      hasConflict: true
    },
    {
      id: `KAZU-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: "FPCNZ Corporate",
      guestPhone: "04 802 4868",
      date: tomorrowStr,
      timeSlot: "19:30",
      partySize: 10,
      tableId: "21,22,23,24",
      specialRequests: "Corporate dinner, premium sake.",
      status: "Confirmed",
      hasConflict: false
    },
    {
      id: `KAZU-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: "Sake Club Wellington",
      guestPhone: "021 555 7777",
      date: tomorrowStr,
      timeSlot: "20:00",
      partySize: 6,
      tableId: "31,32,33,34",
      specialRequests: "Sake tasting event.",
      status: "Confirmed",
      hasConflict: false
    },
    {
      id: `KAZU-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: "Liam O'Connor",
      guestPhone: "022 555 3333",
      date: tomorrowStr,
      timeSlot: "20:30",
      partySize: 2,
      tableId: "87",
      specialRequests: "Late night yakitori.",
      status: "Confirmed",
      hasConflict: false
    }
  ];
  
  const currentReservations = getReservations().filter(r => r.date !== tomorrowStr);
  const updatedReservations = [...currentReservations, ...mockBookings];
  
  saveAllReservations(updatedReservations);
  
  alert(`Successfully seeded 10 mock reservations for tomorrow (${tomorrowStr})!`);
  
  closeSettingsDrawer();
  
  document.getElementById("view-date").value = tomorrowStr;
  renderBookingsList();
  updateFloorPlanVisualState();
  updateTableDropdownAvailability();
}

function initDateDropdowns() {
  const manualDateSelect = document.getElementById("manual-date");
  const viewDateSelect = document.getElementById("view-date");
  if (!manualDateSelect || !viewDateSelect) return;
  
  manualDateSelect.innerHTML = "";
  viewDateSelect.innerHTML = "";
  
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    
    let display = d.toLocaleDateString("en-NZ", { weekday: 'short', day: 'numeric', month: 'short' });
    if (i === 0) display = `Today (${display})`;
    else if (i === 1) display = `Tomorrow (${display})`;
    
    manualDateSelect.add(new Option(display, dateStr));
    viewDateSelect.add(new Option(display, dateStr));
  }
}

// ==========================================
// ADVANCED STAFF CONSOLE COMPONENT LOGIC
// ==========================================

// Load custom table configurations
function loadTablesConfig() {
  const saved = localStorage.getItem("kazu_tables_config");
  if (saved) {
    const overrides = JSON.parse(saved);
    TABLES.forEach(t => {
      const match = overrides.find(o => o.id === t.id);
      if (match) {
        t.minPax = parseInt(match.minPax, 10);
        t.maxPax = parseInt(match.maxPax, 10);
        t.priority = parseInt(match.priority, 10);
        if (match.name) t.name = match.name;
      }
    });
  }
}

// Render Table configurator grid
function renderTableConfigTable() {
  const tbody = document.getElementById("table-config-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  TABLES.forEach(t => {
    // Determine current priority value (fallback if undefined)
    const currentPriority = t.priority !== undefined ? t.priority : getDefaultTablePriority(t.id, t.maxPax);
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600;">${t.name} (ID: ${t.id})</td>
      <td style="color: var(--color-text-muted);">${t.section}</td>
      <td>
        <input type="number" class="config-input" data-table-id="${t.id}" data-field="minPax" value="${t.minPax}" min="1" max="10">
      </td>
      <td>
        <input type="number" class="config-input" data-table-id="${t.id}" data-field="maxPax" value="${t.maxPax}" min="1" max="10">
      </td>
      <td>
        <input type="number" class="config-input" data-table-id="${t.id}" data-field="priority" value="${currentPriority}" min="1" max="999">
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Save Table Configurations
function saveTableConfig() {
  const tbody = document.getElementById("table-config-tbody");
  const inputs = tbody.querySelectorAll(".config-input");
  const overrides = [];
  
  // Build overrides map
  const tableMap = {};
  inputs.forEach(input => {
    const tableId = input.getAttribute("data-table-id");
    const field = input.getAttribute("data-field");
    const val = parseInt(input.value, 10);
    
    if (!tableMap[tableId]) tableMap[tableId] = { id: tableId };
    tableMap[tableId][field] = val;
  });
  
  // Save map values to array
  for (const info of Object.values(tableMap)) {
    overrides.push(info);
    
    // Apply in-memory immediately
    const t = TABLES.find(tbl => tbl.id === info.id);
    if (t) {
      t.minPax = info.minPax;
      t.maxPax = info.maxPax;
      t.priority = info.priority;
    }
  }
  
  localStorage.setItem("kazu_tables_config", JSON.stringify(overrides));
  
  // Sync to Firestore if active
  if (firebaseInitialized && db) {
    db.collection("settings").doc("tables").set({ data: overrides })
      .catch(err => console.error("Error syncing tables to Firestore: ", err));
  }
  
  initTableAssignmentDropdowns();
  updateTableDropdownAvailability();
  suggestBestTable();
  
  document.getElementById("table-config-modal-backdrop").classList.remove("active");
  alert("Table configurations and capacity rules saved successfully!");
}

// Reset Table Config to Default
function resetTableConfig() {
  if (confirm("Reset all table capacities and priority settings to factory defaults?")) {
    localStorage.removeItem("kazu_tables_config");
    location.reload();
  }
}

// Waitlist database functions
function getWaitlist() {
  const data = localStorage.getItem("kazu_waitlist_data");
  return data ? JSON.parse(data) : [];
}

function saveWaitlist(list) {
  localStorage.setItem("kazu_waitlist_data", JSON.stringify(list));
  
  if (firebaseInitialized && db) {
    list.forEach(item => {
      const { id, ...body } = item;
      db.collection("waitlist").doc(item.id).set(body)
        .catch(err => console.error("Error syncing waitlist doc: ", err));
    });
  }
}

// Handle Waitlist form submit
function handleWaitlistSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById("wait-name").value.trim();
  const phone = document.getElementById("wait-phone").value.trim();
  const partySize = parseInt(document.getElementById("wait-pax").value, 10);
  const estWait = document.getElementById("wait-est").value;
  const notes = document.getElementById("wait-notes").value.trim();
  
  const now = new Date();
  const checkInTime = now.toLocaleTimeString("en-NZ", { hour: '2-digit', minute: '2-digit' });
  
  const entry = {
    id: `WAIT-${Math.floor(1000 + Math.random() * 9000)}`,
    guestName: name,
    guestPhone: phone,
    partySize: partySize,
    estWait: estWait,
    specialRequests: notes,
    checkInTime: checkInTime,
    timestamp: now.getTime(),
    status: "Waiting"
  };
  
  const list = getWaitlist();
  list.push(entry);
  saveWaitlist(list);
  
  // Clear form
  document.getElementById("wait-name").value = "";
  document.getElementById("wait-phone").value = "";
  document.getElementById("wait-notes").value = "";
  document.getElementById("wait-pax").value = "2";
  document.getElementById("wait-est").value = "30 mins";
  
  renderWaitlistQueue();
}

// Render waitlist cards
function renderWaitlistQueue() {
  const container = document.getElementById("waitlist-queue-container");
  if (!container) return;
  container.innerHTML = "";
  
  const list = getWaitlist().filter(item => item.status === "Waiting")
                           .sort((a, b) => a.timestamp - b.timestamp);
                           
  if (list.length === 0) {
    container.innerHTML = `<p style="font-style: italic; color: var(--color-text-muted); font-size: 0.85rem; text-align: center; margin-top: 1rem;">Waitlist queue is empty.</p>`;
    return;
  }
  
  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "waitlist-item";
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.3rem;">
        <div style="font-weight: bold; color: var(--color-text-light);">${item.guestName} (${item.partySize} pax)</div>
        <span style="font-size: 0.75rem; color: var(--color-accent); font-weight: 500;">Est: ${item.estWait}</span>
      </div>
      <div style="font-size: 0.75rem; color: var(--color-text-muted);">Phone: ${item.guestPhone} | Checked in: ${item.checkInTime}</div>
      ${item.specialRequests ? `<div style="font-size: 0.75rem; color: var(--color-text-muted); font-style: italic; margin-top: 0.2rem;">💬 "${item.specialRequests}"</div>` : ""}
      <div style="display: flex; gap: 0.4rem; justify-content: flex-end; margin-top: 0.5rem;">
        <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;" onclick="seatWaitlist('${item.id}')">🪑 Seat</button>
        <button class="btn btn-danger" style="font-size: 0.75rem; padding: 0.2rem 0.5rem; background: rgba(231,76,60,0.2); border: 1px solid rgba(231,76,60,0.4); color: #e74c3c;" onclick="cancelWaitlist('${item.id}')">✖ Cancel</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Seat waitlist item (pre-fills phone booking form)
window.seatWaitlist = function(id) {
  const list = getWaitlist();
  const item = list.find(w => w.id === id);
  if (!item) return;
  
  activeSeatingWaitlistId = id;
  
  // Switch to booking form tab
  document.getElementById("btn-tab-booking").click();
  
  // Pre-fill fields
  manualNameInput.value = item.guestName;
  manualPhoneInput.value = item.guestPhone;
  manualPaxSelect.value = item.partySize;
  manualNotesInput.value = item.specialRequests ? `[Waitlist] ${item.specialRequests}` : "[Waitlist]";
  
  // Re-eval suggested seats
  updateTableDropdownAvailability();
  suggestBestTable();
  
  alert(`Pre-filled booking form for ${item.guestName} (${item.partySize} pax). Please select a table to finalize seating!`);
};

// Cancel waitlist item
window.cancelWaitlist = function(id) {
  const list = getWaitlist();
  const item = list.find(w => w.id === id);
  if (item) {
    item.status = "Cancelled";
    saveWaitlist(list);
    renderWaitlistQueue();
    
    // Explicit sync update to Firestore
    if (firebaseInitialized && db) {
      db.collection("waitlist").doc(id).update({ status: "Cancelled" })
        .catch(err => console.error("Error updating waitlist status: ", err));
    }
  }
};

// Helper: mark waitlist as seated in database
function markWaitlistAsSeated(id) {
  const list = getWaitlist();
  const item = list.find(w => w.id === id);
  if (item) {
    item.status = "Seated";
    saveWaitlist(list);
    renderWaitlistQueue();
    
    // Explicit sync update to Firestore
    if (firebaseInitialized && db) {
      db.collection("waitlist").doc(id).update({ status: "Seated" })
        .catch(err => console.error("Error updating waitlist status: ", err));
    }
  }
}

// Service Analytics logic
function generateAnalyticsReport() {
  const viewDate = document.getElementById("view-date").value;
  const activeBookings = getReservations().filter(r => r.date === viewDate && r.status !== "Cancelled");
  
  // 1. Calculate Averages
  const totalCovers = activeBookings.reduce((sum, r) => sum + r.partySize, 0);
  const avgCovers = activeBookings.length > 0 ? (totalCovers / activeBookings.length).toFixed(1) : "0.0";
  document.getElementById("anal-avg-covers").textContent = avgCovers;
  
  // 2. Identify busiest time slot and top dining section
  const slotCovers = {};
  const sectionCovers = {};
  
  // Define operational 30m slots: 17:00 to 22:00
  const timeSlots = [];
  for (let h = 17; h <= 22; h++) {
    timeSlots.push(`${h}:00`, `${h}:30`);
  }
  
  timeSlots.forEach(slot => {
    slotCovers[slot] = 0;
  });
  
  activeBookings.forEach(res => {
    const resMins = timeToMinutes(res.timeSlot);
    
    // Find section from TABLES definition
    const tableIds = res.tableId.split(",");
    tableIds.forEach(tId => {
      const info = TABLES.find(t => t.id === tId);
      if (info) {
        const sec = info.section;
        sectionCovers[sec] = (sectionCovers[sec] || 0) + res.partySize;
      }
    });
    
    // Accumulate slot load (assuming 2 hour duration)
    timeSlots.forEach(slot => {
      const slotMins = timeToMinutes(slot);
      if (slotMins >= resMins && slotMins < resMins + 120) {
        slotCovers[slot] += res.partySize;
      }
    });
  });
  
  // Find Peak Slot
  let peakTime = "N/A";
  let maxCovers = 0;
  for (const [slot, covers] of Object.entries(slotCovers)) {
    if (covers > maxCovers) {
      maxCovers = covers;
      peakTime = format12Hour(slot);
    }
  }
  document.getElementById("anal-peak-time").textContent = maxCovers > 0 ? `${peakTime} (${maxCovers} covers)` : "N/A";
  
  // Find Top Section
  let topSec = "N/A";
  let maxSecCovers = 0;
  for (const [sec, covers] of Object.entries(sectionCovers)) {
    if (covers > maxSecCovers) {
      maxSecCovers = covers;
      topSec = sec;
    }
  }
  document.getElementById("anal-top-section").textContent = topSec;
  
  // 3. Render CSS flex bar chart
  renderAnalyticsChart(slotCovers, maxCovers);
  
  // 4. Render Table Occupancy Rate Table
  renderAnalyticsTable(activeBookings, timeSlots.length);
}

function renderAnalyticsChart(slotCovers, maxCovers) {
  const container = document.getElementById("analytics-chart-container");
  if (!container) return;
  container.innerHTML = "";
  
  for (const [slot, covers] of Object.entries(slotCovers)) {
    const pct = maxCovers > 0 ? (covers / maxCovers) * 100 : 0;
    
    const barWrapper = document.createElement("div");
    barWrapper.className = "chart-bar-wrapper";
    barWrapper.innerHTML = `
      <div class="chart-tooltip">${format12Hour(slot)}: <strong>${covers} covers</strong></div>
      <div class="chart-bar" style="height: ${pct}%;"></div>
      <div class="chart-label">${slot}</div>
    `;
    container.appendChild(barWrapper);
  }
}

function renderAnalyticsTable(activeBookings, totalSlots) {
  const tbody = document.getElementById("analytics-occupancy-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  // Calculate slot occupancy count per table
  const tableOccupiedSlots = {};
  TABLES.forEach(t => {
    tableOccupiedSlots[t.id] = 0;
  });
  
  activeBookings.forEach(res => {
    const resMins = timeToMinutes(res.timeSlot);
    const tableIds = res.tableId.split(",");
    
    tableIds.forEach(tId => {
      // Loop over 30m slots during booking duration
      for (let offset = 0; offset < 120; offset += 30) {
        const slotMins = resMins + offset;
        const h = Math.floor(slotMins / 60);
        const m = slotMins % 60;
        
        // Ensure within restaurant hours
        if (slotMins >= timeToMinutes(systemSettings.openTime) && slotMins <= timeToMinutes("22:00")) {
          tableOccupiedSlots[tId] = (tableOccupiedSlots[tId] || 0) + 1;
        }
      }
    });
  });
  
  TABLES.forEach(t => {
    const occupied = tableOccupiedSlots[t.id] || 0;
    const rate = totalSlots > 0 ? Math.round((occupied / totalSlots) * 100) : 0;
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 500;">${t.name}</td>
      <td>${t.section}</td>
      <td style="text-align: center;">${occupied} / ${totalSlots}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="flex-grow: 1; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; border: 1px solid var(--border-glass);">
            <div style="width: ${rate}%; height: 100%; background: ${rate > 50 ? 'linear-gradient(90deg, #e74c3c, #c1121f)' : 'linear-gradient(90deg, #2ecc71, #27ae60)'};"></div>
          </div>
          <span>${rate}%</span>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Firebase Cloud Synchronization Logic
let db = null;
let firebaseInitialized = false;

function initFirebaseSync() {
  if (!systemSettings.firebaseEnabled || !systemSettings.firebaseConfig || !systemSettings.firebaseConfig.projectId) {
    return;
  }
  
  if (firebaseInitialized) return;
  
  // Dynamically load Firebase SDKs from CDN
  const sdkScript = document.createElement("script");
  sdkScript.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
  document.head.appendChild(sdkScript);
  
  sdkScript.onload = () => {
    const firestoreScript = document.createElement("script");
    firestoreScript.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js";
    document.head.appendChild(firestoreScript);
    
    firestoreScript.onload = () => {
      try {
        const firebaseConfig = {
          apiKey: systemSettings.firebaseConfig.apiKey,
          authDomain: systemSettings.firebaseConfig.authDomain || `${systemSettings.firebaseConfig.projectId}.firebaseapp.com`,
          projectId: systemSettings.firebaseConfig.projectId,
          appId: systemSettings.firebaseConfig.appId
        };
        
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        firebaseInitialized = true;
        console.log("Firebase initialized successfully");
        
        setupFirestoreListeners();
        alert("Firebase Cloud Sync initialized successfully!");
      } catch (err) {
        console.error("Firebase init failed: ", err);
        alert("Firebase setup failed. Falling back to local offline storage.");
      }
    };
  };
}

function setupFirestoreListeners() {
  if (!db) return;
  
  // Listen to Reservations
  db.collection("reservations").onSnapshot(snapshot => {
    let localRes = getReservations();
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      const id = change.doc.id;
      const index = localRes.findIndex(r => r.id === id);
      
      if (change.type === "added" || change.type === "modified") {
        const item = { id, ...data };
        if (index === -1) {
          localRes.push(item);
        } else {
          localRes[index] = item;
        }
      } else if (change.type === "removed") {
        if (index !== -1) {
          localRes.splice(index, 1);
        }
      }
    });
    
    localStorage.setItem("kazu_backend_reservations", JSON.stringify(localRes));
    renderBookingsList();
    updateFloorPlanVisualState();
    updateTableDropdownAvailability();
  });
  
  // Listen to Settings
  db.collection("settings").doc("system").onSnapshot(doc => {
    if (doc.exists) {
      const remoteSettings = doc.data();
      systemSettings.email = remoteSettings.email || systemSettings.email;
      systemSettings.openTime = remoteSettings.openTime || systemSettings.openTime;
      systemSettings.closeTime = remoteSettings.closeTime || systemSettings.closeTime;
      localStorage.setItem("kazu_system_settings", JSON.stringify(systemSettings));
      
      document.getElementById("active-email-display").textContent = `(Monitoring: ${systemSettings.email})`;
      initFormTimeDropdowns();
    }
  });

  // Listen to Waitlist
  db.collection("waitlist").onSnapshot(snapshot => {
    let localWait = getWaitlist();
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      const id = change.doc.id;
      const index = localWait.findIndex(w => w.id === id);
      
      if (change.type === "added" || change.type === "modified") {
        const item = { id, ...data };
        if (index === -1) {
          localWait.push(item);
        } else {
          localWait[index] = item;
        }
      } else if (change.type === "removed") {
        if (index !== -1) {
          localWait.splice(index, 1);
        }
      }
    });
    
    localStorage.setItem("kazu_waitlist_data", JSON.stringify(localWait));
    renderWaitlistQueue();
  });
}

// Calculates dynamic seating end times and last order limits (30 mins before end)
function getSeatingTimeDetails(res) {
  const startMins = timeToMinutes(res.timeSlot);
  const reservations = getReservations().filter(r => r.date === res.date && r.status !== "Cancelled" && r.id !== res.id);
  
  const targetTableIds = res.tableId.split(",");
  let nextStartMins = startMins + 120; // Default duration is 2 hours (120 mins)
  
  reservations.forEach(r => {
    const rMins = timeToMinutes(r.timeSlot);
    if (rMins > startMins && rMins < nextStartMins) {
      const rTableIds = r.tableId.split(",");
      const sharesTable = rTableIds.some(id => targetTableIds.includes(id));
      if (sharesTable) {
        nextStartMins = rMins;
      }
    }
  });
  
  const lastOrderMins = Math.max(startMins, nextStartMins - 30);
  
  const formatMins = (totalMins) => {
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const hStr = hours < 10 ? `0${hours}` : hours;
    const mStr = mins < 10 ? `0${mins}` : mins;
    return `${hStr}:${mStr}`;
  };
  
  return {
    endTime: formatMins(nextStartMins),
    lastOrderTime: formatMins(lastOrderMins)
  };
}
