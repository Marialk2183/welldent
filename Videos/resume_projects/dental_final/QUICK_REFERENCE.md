# Quick Reference - Interview Cheat Sheet

## 🎯 ONE-LINER
Desktop dental lab management app built with Electron, Node.js, Express.js, SQLite3, and Puppeteer for PDF generation.

---

## 📦 TECH STACK (Short Version)
**Electron | Node.js | Express.js | SQLite3 | JavaScript | HTML5/CSS3 | Puppeteer | electron-builder**

---

## 🏗️ ARCHITECTURE IN 30 SECONDS

```
User Interface (HTML/CSS/JS)
    ↓
Renderer Process
    ↓
IPC Communication / REST API
    ↓
Main Process / Express Server
    ↓
Database Module
    ↓
SQLite3 Database
```

---

## 🔄 DATA FLOW (3 Methods)

### Method 1: IPC (Direct)
```
HTML → JavaScript → preload.js → IPC → main.js → database.js → SQLite
```

### Method 2: REST API
```
HTML → JavaScript → fetch() → Express Server → database.js → SQLite
```

### Method 3: PDF Generation
```
HTML → IPC → main.js → Puppeteer → PDF File
```

---

## 🗄️ DATABASE (10 Tables)

1. **dental_records** - Patient records
2. **materials** - Inventory
3. **invoices** - Invoicing (auto-serial)
4. **cards** - Patient cards
5. **challans** - Delivery challans
6. **expenses** - Expense tracking
7. **notes** - Clinical notes
8. **registrations** - Patient registration
9. **salaries** - Employee salaries
10. **serial_counter** - Invoice serial tracking

---

## 🔑 KEY FILES

| File | Purpose |
|------|---------|
| `main.js` | Electron main process, window management, IPC |
| `server.js` | Express REST API server (port 3000) |
| `database/database.js` | SQLite operations, CRUD functions |
| `preload.js` | Secure IPC bridge (contextBridge) |
| `html/home.html` | Main UI dashboard |

---

## 🔐 SECURITY (5 Points)

1. ✅ Context Isolation enabled
2. ✅ Node Integration disabled
3. ✅ Preload script with contextBridge
4. ✅ SQL parameterized queries
5. ✅ Input validation

---

## 🎤 COMMON QUESTIONS

**Q: Why Electron?**  
A: Build desktop apps with web tech, cross-platform, Node.js access.

**Q: Main vs Renderer?**  
A: Main = app lifecycle, IPC, Node.js access. Renderer = UI, no Node.js (secure).

**Q: Why SQLite?**  
A: Desktop app, no server needed, file-based, easy backup.

**Q: How PDF works?**  
A: Puppeteer launches Chrome, renders HTML template, saves as PDF.

**Q: IPC vs REST?**  
A: IPC = faster, direct. REST = standardized, extensible.

---

## 📊 VERSIONS

- Electron: 31.7.7
- Express: 5.1.0
- SQLite3: 5.1.7
- Puppeteer: 22.15.0

---

## 🚀 COMMANDS

```bash
npm start      # Run app
npm run build  # Build installer
```

---

## 💡 FEATURES TO HIGHLIGHT

- ✅ Desktop application with Electron
- ✅ RESTful API with Express
- ✅ File-based database (SQLite)
- ✅ PDF generation (Puppeteer)
- ✅ Security best practices
- ✅ Cross-platform ready
- ✅ 10 database tables
- ✅ Search functionality
- ✅ Auto-incrementing serials

---

**Remember: You built a complete desktop application! 🎉**

