# Dental Management System - Technical Stack Report

## Executive Summary

This is a **Desktop Application** built using Electron framework for dental lab management. The system provides comprehensive functionality for managing dental records, invoices, materials, expenses, salaries, and generating PDF reports. The application follows a hybrid architecture combining Electron's desktop capabilities with a web-based UI and RESTful API backend.

---

## 1. Technology Stack Overview

### 1.1 Core Framework
- **Electron** (v31.7.7)
  - Cross-platform desktop application framework
  - Enables building desktop apps with web technologies (HTML, CSS, JavaScript)
  - Main process handles application lifecycle and system integration
  - Renderer process handles UI rendering

### 1.2 Runtime Environment
- **Node.js**
  - JavaScript runtime for backend services
  - Enables server-side operations and file system access

### 1.3 Programming Languages
- **JavaScript (ES6+)**
  - Primary language for both frontend and backend
  - No TypeScript or additional transpilation

---

## 2. Backend Architecture

### 2.1 Web Server
- **Express.js** (v5.1.0)
  - RESTful API server
  - Handles HTTP requests and responses
  - Port: 3000 (default)
  - CORS enabled for cross-origin requests

### 2.2 Database
- **SQLite3** (v5.1.7)
  - Lightweight, file-based relational database
  - Database file: `dental.db`
  - No separate database server required
  - Supports concurrent connections (with limitations)

### 2.3 Database Schema
The application manages the following tables:

1. **dental_records** - Patient dental records
   - Fields: id, doctor_name, patient_name, age, sex, sr_no, date_of_order, date_of_delivery, stage_fixed, shade, selected_teeth, instructions, created_at

2. **materials** - Inventory management
   - Fields: id, name, quantity, cost, date_added, created_at

3. **invoices** - Invoice management
   - Fields: id, serial, date, invoice_number, price, description, created_at

4. **cards** - Patient card management
   - Fields: id, card_number, patient_name, expiry_date, created_at

5. **challans** - Delivery challan management
   - Fields: id, challan_number, patient_name, delivery_date, status, created_at

6. **expenses** - Expense tracking
   - Fields: id, description, amount, date, created_at

7. **notes** - Clinical notes
   - Fields: id, patient_name, doctor_name, note_text, date_added, created_at

8. **registrations** - Patient registration
   - Fields: id, patient_name, email, phone, registration_date, created_at

9. **salaries** - Employee salary management
   - Fields: id, employee_name, amount, date_paid, created_at

10. **serial_counter** - Invoice serial number tracking
    - Fields: id (always 1), last_serial

---

## 3. Frontend Architecture

### 3.1 UI Framework
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Client-side logic (no frameworks like React/Vue)

### 3.2 IPC Communication
- **Electron IPC (Inter-Process Communication)**
  - `ipcMain` - Main process handler
  - `ipcRenderer` - Renderer process handler
  - `contextBridge` - Secure API exposure (preload.js)

### 3.3 Security Features
- **Context Isolation**: Enabled
- **Node Integration**: Disabled (security best practice)
- **Preload Script**: Secure API bridge between main and renderer processes

---

## 4. Key Dependencies

### 4.1 Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `cors` | ^2.8.5 | Enable Cross-Origin Resource Sharing |
| `express` | ^5.1.0 | Web application framework |
| `pdfkit` | ^0.17.1 | PDF generation library |
| `puppeteer` | ^22.15.0 | Headless Chrome for PDF generation |
| `sqlite3` | ^5.1.7 | SQLite database driver |

### 4.2 Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `electron` | 31.7.7 | Desktop application framework |
| `electron-builder` | ^26.0.12 | Packaging and distribution tool |

---

## 5. Application Structure

### 5.1 File Organization

```
dental_final/
├── main.js              # Electron main process
├── renderer.js          # Renderer process script
├── preload.js           # Preload script for secure IPC
├── server.js            # Express API server
├── db.js                # Legacy database utilities
├── database/
│   ├── database.js      # Main database operations
│   └── dental.db        # SQLite database file
├── html/                # UI pages
│   ├── home.html        # Main dashboard
│   ├── card.html        # Card management
│   ├── challan.html     # Challan management
│   ├── exp.html         # Expense management
│   ├── invoice.html     # Invoice management
│   ├── materials.html   # Material inventory
│   ├── note.html        # Clinical notes
│   ├── notePdf.html     # PDF note template
│   ├── register.html    # Patient registration
│   └── salary.html      # Salary management
├── assets/
│   ├── css/
│   │   └── style.css    # Global styles
│   └── images/          # Image assets
└── dist/                # Build output directory
```

### 5.2 Core Modules

#### Main Process (main.js)
- Window management
- IPC handlers for form data
- PDF generation via Puppeteer
- Application lifecycle management

#### Renderer Process (renderer.js)
- DOM manipulation
- Form handling
- IPC communication with main process
- Data display

#### Preload Script (preload.js)
- Secure API exposure using `contextBridge`
- Prevents direct Node.js access in renderer

#### Server (server.js)
- RESTful API endpoints
- Database operations
- PDF generation endpoint
- Search functionality

#### Database Module (database/database.js)
- Generic CRUD operations
- Table-specific functions
- Data validation and sanitization
- Type conversion utilities

---

## 6. API Endpoints

### 6.1 Dental Records
- `POST /api/dental-records` - Create dental record
- `GET /api/dental-records` - Fetch all records
- `PUT /api/dental-records/:id` - Update record
- `GET /api/dental-records/search` - Search records

### 6.2 Invoices
- `GET /api/serial` - Get next invoice serial number
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/search` - Search invoices

### 6.3 Materials
- `POST /api/materials` - Add material
- `GET /api/materials` - Fetch all materials
- `PUT /api/materials/:id` - Update material
- `GET /api/materials/search` - Search materials

### 6.4 Cards
- `POST /api/cards` - Create card
- `GET /api/cards` - Fetch all cards
- `GET /api/cards/search` - Search cards

### 6.5 Challans
- `POST /api/challans` - Create challan
- `GET /api/challans` - Fetch all challans
- `GET /api/challans/search` - Search challans

### 6.6 Expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses` - Fetch all expenses
- `GET /api/expenses/search` - Search expenses

### 6.7 Notes
- `POST /api/notes` - Create note
- `GET /api/notes` - Fetch all notes
- `GET /api/notes/search` - Search notes

### 6.8 Registrations
- `POST /api/registrations` - Register patient
- `GET /api/registrations` - Fetch all registrations
- `GET /api/registrations/search` - Search registrations

### 6.9 Salaries
- `POST /api/salaries` - Add salary record
- `GET /api/salaries` - Fetch all salaries
- `PUT /api/salaries/:id` - Update salary
- `GET /api/salaries/search` - Search salaries

### 6.10 PDF Generation
- `POST /api/generate-pdf` - Generate dental note PDF

---

## 7. PDF Generation

### 7.1 Technologies
- **Puppeteer** - Headless Chrome browser automation
  - Converts HTML to PDF
  - Supports custom styling and formatting
  - A4 format with print background enabled

- **PDFKit** (installed but not actively used in current implementation)
  - Alternative PDF generation library

### 7.2 PDF Features
- Dental lab note format
- Tooth number mapping (Upper/Lower, Left/Right quadrants)
- Instructions, shade, and trial type inclusion
- Professional styling with A4 page format

---

## 8. Build & Distribution

### 8.1 Build Tool
- **electron-builder** (v26.0.12)
  - Packages application for Windows
  - Creates NSIS installer
  - Output directory: `dist/`

### 8.2 Build Configuration
```json
{
  "appId": "com.umed.dental",
  "productName": "DentalManagement",
  "target": "nsis",
  "asarUnpack": "**\\node_modules\\**"
}
```

### 8.3 Build Output
- Windows executable: `DentalManagement Setup 1.0.0.exe`
- Unpacked application in `dist/win-unpacked/`
- ASAR archive for application files

---

## 9. Application Features

### 9.1 Core Functionality
1. **Patient Management**
   - Patient registration
   - Dental records management
   - Patient cards

2. **Clinical Management**
   - Dental notes
   - Tooth selection and tracking
   - Stage and shade management
   - Delivery date tracking

3. **Financial Management**
   - Invoice generation with auto-incrementing serial numbers
   - Expense tracking
   - Salary management
   - Payment tracking

4. **Inventory Management**
   - Material tracking
   - Quantity and cost management
   - Date-based inventory history

5. **Document Generation**
   - PDF note generation
   - Invoice printing
   - Challan generation

6. **Search & Filter**
   - Search across all modules
   - Patient name, ID, and serial number searches

---

## 10. Development Workflow

### 10.1 Scripts
```json
{
  "start": "electron",           // Run development version
  "build": "electron-builder --win"  // Build Windows installer
}
```

### 10.2 Development Setup
1. Install dependencies: `npm install`
2. Run development: `npm start`
3. Build distribution: `npm run build`

---

## 11. Security Considerations

### 11.1 Implemented Security Measures
- ✅ Context isolation enabled
- ✅ Node integration disabled in renderer
- ✅ Preload script for secure API exposure
- ✅ Input validation in API endpoints
- ✅ SQL parameterized queries (prepared statements)

### 11.2 Potential Security Improvements
- ⚠️ Add authentication/authorization
- ⚠️ Input sanitization for XSS prevention
- ⚠️ Rate limiting for API endpoints
- ⚠️ Database encryption for sensitive data
- ⚠️ HTTPS for API communication (if networked)

---

## 12. Performance Characteristics

### 12.1 Strengths
- Lightweight SQLite database (no server overhead)
- Local file-based storage (fast access)
- Efficient IPC communication
- Minimal dependencies

### 12.2 Considerations
- SQLite concurrent write limitations
- Puppeteer overhead for PDF generation
- Single-threaded JavaScript execution
- Large database file size potential

---

## 13. Deployment

### 13.1 Target Platform
- **Windows** (primary)
  - NSIS installer
  - Standalone executable
  - Portable application option

### 13.2 Installation
- User runs `DentalManagement Setup 1.0.0.exe`
- Installs to Program Files
- Creates desktop shortcut
- Database file stored locally

---

## 14. Maintenance & Support

### 14.1 Database Management
- SQLite file-based database
- Backup: Copy `dental.db` file
- No migration system currently implemented

### 14.2 Logging
- Console logging for debugging
- Error handling in database operations
- API error responses

---

## 15. Project Metadata

- **Project Name**: Dental Management System
- **Version**: 1.0.0
- **Author**: umed
- **License**: ISC
- **Description**: Management System for dental lab operations

---

## 16. Technology Versions Summary

| Technology | Version | Type |
|------------|---------|------|
| Electron | 31.7.7 | Framework |
| Node.js | (Runtime) | Runtime |
| Express | 5.1.0 | Web Framework |
| SQLite3 | 5.1.7 | Database |
| Puppeteer | 22.15.0 | PDF Generation |
| PDFKit | 0.17.1 | PDF Library |
| CORS | 2.8.5 | Middleware |
| electron-builder | 26.0.12 | Build Tool |

---

## 17. Conclusion

This Dental Management System is a well-structured desktop application built with modern web technologies. It combines Electron's desktop capabilities with a RESTful API backend and SQLite database, providing a complete solution for dental lab management. The application follows security best practices with context isolation and secure IPC communication, while maintaining a clean separation between frontend and backend concerns.

The tech stack is appropriate for a desktop application requiring local data storage, PDF generation, and a user-friendly interface. The modular architecture allows for easy maintenance and future enhancements.

---

**Report Generated**: 2025
**Project Path**: `C:\Users\maria\Videos\projects\dental_final`

