# Kazu Yakitori & Sake Bar - Booking Web Application

Welcome to **Kazu Yakitori & Sake Bar**, an interactive booking web application custom-designed for the popular Japanese restaurant and sake bar located at **Level 1, 43 Courtenay Place, Te Aro, Wellington**.

This application is built with a warm Japanese Izakaya aesthetic (charcoal black, sake red, and glowing amber accents) resembling traditional Japanese lanterns and grilling fires. It operates entirely as a serverless static web application using modern HTML5, CSS3, and ES6+ JavaScript, persisting bookings locally inside the browser's `localStorage`.

---

## Features

### 1. Customer-Facing Booking Portal (`index.html`)
* **Multi-Step Wizard**:
  * **Step 1**: Select Date, Party Size (1 to 8 guests), and Preferred Dining Time range.
  * **Step 2**: Choose a specific half-hour dining slot (e.g., 7:00 PM).
  * **Step 3**: Interactive SVG Floor Plan selector. Highlighted tables are interactive; restricted or occupied tables are deactivated.
  * **Step 4**: Complete contact details and view a booking summary before final confirmation.
* **Success View**: Generates a custom booking reference (e.g. `KAZU-4912`) and provides a confirmation card.
* **2-Hour Reservation Limits**: Automatically prevents booking overlaps by blocking tables for 120 minutes from the start of an existing reservation.

### 2. Staff Dashboard (`dashboard.html`)
* **Live Occupancy Stats**: Calculates and displays total daily bookings, total guests seated, and table occupancy rate (percentage of tables currently booked).
* **Search & Filters**:
  * Date filter (defaults to today).
  * Area filters (Dining Tables, Sharing Tables, Counter Seats, Courtenay Balcony, Tatami Booths).
  * Query search (matches name, phone, email, reference code, or table number).
* **Status Controls**: Allow staff to check-in or cancel reservations in real time.
* **Demo Data Seeding**: Click the "Seed Test Data" button to instantly populate the dashboard with 8 realistic Wellington reservations to test out filters and availability.

---

## Bar Layout & Table Rules

The interactive map enforces the following rules from the bar's floor plan:

| Table ID | Section | Max Capacity | Special Rules |
| :--- | :--- | :--- | :--- |
| **1** | Dining Room | 8 | Big table; requires **at least 5 people** to book. |
| **4, 5, 6** | Dining Room | 4 | Cozy dining tables; require **at least 3 people** to book. |
| **21 - 24** | Dining Room | 3 (per side) | Share Table #2 sides. Multiple parties can book different corners. |
| **31 - 34** | Dining Room | 3 (per side) | Share Table #3 sides. Multiple parties can book different corners. |
| **71, 73, 75, 77, 79** | Yakitori Grill | 2 | Grill Counter tables (each represents a 2-seat pair). |
| **81, 83, 85** | Sake Bar | 2 | Sake Bar Counter tables (each represents a 2-seat pair). |
| **87** | Sake Bar | 1 | Single Sake Bar Counter end-stool. |
| **91 - 93** | Courtenay Balcony | 2 | Outdoor seating overlooking Courtenay Place. |
| **95 - 96** | Tatami Booth | 2 | Intimate indoor tatami-style tables. |

---

## How to Run the App

Since the app is built using vanilla HTML/CSS/JS, you can run it directly in your browser or serve it using a simple local web server.

### Option A: Serve with Python (Recommended)
If you have Python installed, open your terminal in this directory and run:

```bash
# Python 3
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your web browser.

### Option B: Open File Directly
Double-click `index.html` in your file explorer to open the customer page, or double-click `dashboard.html` to open the Staff Portal. Note that some older browsers may restrict `localStorage` or module execution over the `file://` protocol, so a local server (Option A) is recommended.
