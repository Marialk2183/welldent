# Welldent Dental Lab Management System

A comprehensive desktop application for managing dental lab operations, patient records, inventory, invoices, and more. Built with Electron for cross-platform desktop deployment.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![Electron](https://img.shields.io/badge/electron-31.7.7-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Welldent Dental Lab Management System is a full-featured desktop application designed to streamline dental laboratory operations. It provides comprehensive tools for managing patient records, dental procedures, inventory, invoicing, employee salaries, and delivery challans.

### Key Highlights

- **Desktop Application**: Built with Electron for native desktop experience
- **Real-time Data Management**: SQLite database for reliable data storage
- **RESTful API**: Express.js backend for seamless data operations
- **PDF Generation**: Automated PDF generation for reports and invoices
- **User-Friendly Interface**: Modern, responsive UI with intuitive navigation

## ✨ Features

### Core Modules

1. **Patient Management** 🏥
   - Complete patient registration and records
   - Patient search and filtering
   - Detailed patient history tracking
   - Auto-fetch patient data with retry logic

2. **Dental Records** 📝
   - Comprehensive dental procedure tracking
   - Tooth selection interface (Upper/Lower, Left/Right quadrants)
   - Stage tracking (Fixed and Removable)
   - Shade and material specifications
   - Instructions and notes management

3. **Inventory Management** 📦
   - Material tracking and management
   - Quantity and cost monitoring
   - Search functionality
   - Edit and update capabilities

4. **Invoice Management** 💰
   - Automated invoice generation
   - Serial number management
   - Invoice search and retrieval
   - PDF export capabilities

5. **Delivery Challan** 🚚
   - Delivery tracking
   - Challan number generation
   - Status management
   - PDF generation

6. **Warranty Cards** 🎴
   - Patient warranty card management
   - Expiry date tracking
   - Card number generation

7. **Expense Tracking** 💳
   - Daily expense recording
   - Category-wise tracking
   - Date-based filtering

8. **Salary Management** 💵
   - Employee salary records
   - Payment date tracking
   - Search and update functionality

9. **Clinical Notes** 📋
   - Detailed clinical notes
   - Doctor and patient association
   - Date tracking
   - PDF generation

10. **Registration** 📑
    - Patient registration forms
    - Complete dental procedure forms
    - PDF report generation

## 🛠️ Tech Stack

### Frontend
- **Electron** (31.7.7) - Desktop application framework
- **HTML5/CSS3** - User interface
- **JavaScript (ES6+)** - Client-side logic
- **Puppeteer** - PDF generation

### Backend
- **Node.js** - Runtime environment
- **Express.js** (5.1.0) - RESTful API server
- **SQLite3** (5.1.7) - Database
- **CORS** - Cross-origin resource sharing

### Development Tools
- **electron-builder** - Application packaging
- **PDFKit** - PDF document generation

## 📦 Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (Node Package Manager)
- Git

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Marialk2183/welldent.git
   cd welldent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

   This will:
   - Start the Express server automatically (port 3000)
   - Launch the Electron desktop application

4. **Alternative: Start server separately**
   ```bash
   # Terminal 1: Start server
   npm run server
   
   # Terminal 2: Start Electron app
   npm start
   ```

## 🚀 Usage

### Starting the Application

1. Run `npm start` - This automatically starts the server and opens the desktop application
2. The application window will open with the home dashboard
3. Navigate through different modules using the top navigation bar

### Key Workflows

#### Adding a New Patient
1. Click on **"Register"** in the navigation or home page
2. Fill in patient details (Name, Age, Sex, Doctor Name)
3. Select dental procedures and teeth
4. Add instructions and notes
5. Click **"Register"** button to save

#### Viewing All Patients
1. Click on **"Patients"** in the navigation bar (top of page)
2. View all patient records in a comprehensive table
3. Use the search box to filter by patient name, doctor name, or serial number
4. Click **"Refresh Data"** to reload latest records

#### Managing Materials
1. Navigate to **"Materials"** page
2. Add new materials with name, quantity, cost, and date
3. Search for existing materials
4. Edit or update material information

#### Generating Invoices
1. Go to **"Invoice"** page
2. Fill in invoice details
3. System auto-generates serial numbers
4. Generate and download PDF

### Navigation

The application includes a consistent navigation bar across all pages:
- **Patients** - View all patient records
- **Home** - Dashboard with quick access cards
- **Materials** - Inventory management
- **Note** - Clinical notes
- **Card** - Warranty cards
- **Salary** - Employee salary management
- **Register** - Patient registration
- **Invoice** - Invoice management
- **Expenses** - Expense tracking
- **Delivery Challan** - Delivery management

## 📁 Project Structure

```
welldent/
├── html/                    # Frontend HTML pages
│   ├── home.html           # Main dashboard
│   ├── patients.html       # Patient records view
│   ├── register.html       # Patient registration
│   ├── note.html          # Clinical notes
│   ├── materials.html     # Inventory management
│   ├── invoice.html       # Invoice management
│   ├── card.html          # Warranty cards
│   ├── challan.html       # Delivery challans
│   ├── exp.html           # Expense tracking
│   ├── salary.html        # Salary management
│   └── api-config.js      # API configuration utility
├── database/               # Database layer
│   ├── database.js        # Database operations
│   └── dental.db          # SQLite database (created on first run)
├── assets/                 # Static assets
│   ├── css/
│   │   └── style.css      # Global styles
│   └── images/            # Image assets
├── main.js                 # Electron main process
├── preload.js             # Preload script for security
├── renderer.js            # Renderer process script
├── server.js              # Express API server
├── package.json           # Project dependencies
└── README.md             # This file
```

## 🔌 API Endpoints

### Patient Records
- `GET /api/dental-records` - Fetch all patient records
- `POST /api/dental-records` - Create new patient record
- `PUT /api/dental-records/:id` - Update patient record
- `GET /api/dental-records/search?query=...` - Search patient records

### Materials
- `GET /api/materials` - Fetch all materials
- `POST /api/materials` - Add new material
- `PUT /api/materials/:id` - Update material
- `GET /api/materials/search?query=...` - Search materials

### Invoices
- `GET /api/serial` - Get next invoice serial number
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/search?query=...` - Search invoices

### Other Endpoints
- `GET /api/cards` - Fetch warranty cards
- `GET /api/challans` - Fetch delivery challans
- `GET /api/expenses` - Fetch expenses
- `GET /api/salaries` - Fetch salary records
- `GET /api/notes` - Fetch clinical notes
- `GET /api/registrations` - Fetch registrations
- `POST /api/generate-pdf` - Generate PDF documents

## 🗄️ Database Schema

The application uses SQLite with the following main tables:

### dental_records
- Patient and doctor information
- Procedure details
- Tooth selections
- Dates and instructions

### materials
- Material name, quantity, cost
- Date added tracking

### invoices
- Serial numbers
- Invoice details
- Pricing information

### Other Tables
- `cards` - Warranty cards
- `challans` - Delivery challans
- `expenses` - Expense records
- `notes` - Clinical notes
- `registrations` - Patient registrations
- `salaries` - Employee salaries
- `serial_counter` - Invoice serial tracking

## 🎨 Features in Detail

### Auto-Server Startup
The application automatically starts the Express server when launched, eliminating the need for manual server management.

### Patient Data Fetching
- Automatic retry logic (up to 5 attempts)
- Real-time data updates
- Search and filter functionality
- Responsive table display

### PDF Generation
- Automated PDF creation for reports
- Professional formatting
- Download capabilities

### Error Handling
- Comprehensive error messages
- Retry mechanisms for network issues
- User-friendly error notifications

## 🏗️ Building for Production

To create a distributable application:

```bash
npm run build
```

This creates a Windows installer in the `dist/` folder.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Maria**
- GitHub: [@Marialk2183](https://github.com/Marialk2183)

## 🙏 Acknowledgments

- Built with Electron for cross-platform desktop support
- Uses Express.js for robust API functionality
- SQLite for reliable local data storage

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Note**: Make sure the server is running on port 3000 for all API operations. The application automatically starts the server when launched with `npm start`.

