const sqlite3 = require('sqlite3').verbose();
// Pass db instance from server.js to avoid multiple connections
// For now, keep the local db instance but note the conflict
const db = new sqlite3.Database('dental.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    // Dental records table
    db.run(`CREATE TABLE IF NOT EXISTS dental_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_name TEXT,
        patient_name TEXT,
        age INTEGER,
        sex TEXT,
        sr_no TEXT,
        date_of_order TEXT,
        date_of_delivery TEXT,
        stage_fixed TEXT,
        shade TEXT,
        selected_teeth TEXT,
        instructions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating dental_records table', err);
        } else {
            console.log('dental_records table created or already exists.');
        }
    });

    // Materials table (consolidated with NOT NULL and created_at)
    db.run(`CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        cost REAL NOT NULL,
        date_added TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating materials table', err);
        } else {
            console.log('materials table created or already exists.');
        }
    });

    // Cards table (for card.html)
    db.run(`CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_number TEXT,
        patient_name TEXT,
        expiry_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating cards table', err);
        } else {
            console.log('cards table created or already exists.');
        }
    });

    // Challans table (for challan.html)
    db.run(`CREATE TABLE IF NOT EXISTS challans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        challan_number TEXT,
        patient_name TEXT,
        delivery_date TEXT,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating challans table', err);
        } else {
            console.log('challans table created or already exists.');
        }
    });

    // Expenses table (for exp.html)
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        amount REAL,
        date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating expenses table', err);
        } else {
            console.log('expenses table created or already exists.');
        }
    });

    // Notes table (for note.html)
    db.run(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT,
        doctor_name TEXT,
        note_text TEXT,
        date_added TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating notes table', err);
        } else {
            console.log('notes table created or already exists.');
        }
    });

    // Registrations table (for register.html)
    db.run(`CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT,
        email TEXT,
        phone TEXT,
        registration_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating registrations table', err);
        } else {
            console.log('registrations table created or already exists.');
        }
    });

    // Salaries table (for salary.html)
    db.run(`CREATE TABLE IF NOT EXISTS salaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_name TEXT,
        amount REAL,
        date_paid TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating salaries table', err);
        } else {
            console.log('salaries table created or already exists.');
        }
    });

    // Invoices table (added to match server.js usage)
    db.run(`CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        serial TEXT,
        date TEXT,
        invoice_number TEXT,
        price REAL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating invoices table', err);
        } else {
            console.log('invoices table created or already exists.');
        }
    });
});

// Generic save function with type conversion and default date
function saveData(tableName, data, fields, callback) {
    const logPrefix = tableName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    console.log(`Saving ${logPrefix} data:`, data);
    const placeholders = fields.map(() => '?').join(', ');
    const stmt = db.prepare(`
        INSERT INTO ${tableName} (${fields.join(', ')})
        VALUES (${placeholders})
    `);

    const values = fields.map(field => {
        const value = data[field];
        if (field === 'quantity' || field === 'age') return parseInt(value) || 0;
        if (field === 'cost' || field === 'amount') return parseFloat(value) || 0.00;
        if (field === 'date_added' || field === 'date' || field === 'delivery_date' || field === 'date_paid' || field === 'registration_date' || field === 'date_of_order' || field === 'date_of_delivery') {
            return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : new Date().toISOString().split('T')[0]; // "2025-07-01"
        }
        return value || '';
    });

    stmt.run(...values, function(err) {
        if (err) {
            console.error(`Error running ${logPrefix} statement`, err);
            callback(err);
        } else {
            console.log(`${logPrefix} data inserted with id: ${this.lastID}`);
            callback(null, this.lastID);
        }
    });

    stmt.finalize();
}

// Generic fetch function
function fetchData(tableName, orderBy, callback) {
    const logPrefix = tableName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    db.all(`SELECT * FROM ${tableName} ORDER BY ${orderBy} DESC`, (err, rows) => {
        if (err) {
            console.error(`Error fetching ${logPrefix} data`, err);
            callback([]);
        } else {
            console.log(`Fetched ${logPrefix} data:`, rows);
            callback(rows);
        }
    });
}

// Generic update function
function updateData(tableName, id, data, fields, callback) {
    const logPrefix = tableName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    console.log(`Updating ${logPrefix} data:`, data);
    const setClauses = fields.map(field => `${field} = ?`).join(', ');
    const stmt = db.prepare(`
        UPDATE ${tableName} SET ${setClauses} WHERE id = ?
    `);

    const values = fields.map(field => {
        const value = data[field];
        if (field === 'quantity' || field === 'age') return parseInt(value) || 0;
        if (field === 'cost' || field === 'amount') return parseFloat(value) || 0.00;
        if (field === 'date_added' || field === 'date' || field === 'delivery_date' || field === 'date_paid' || field === 'registration_date' || field === 'date_of_order' || field === 'date_of_delivery') {
            return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : new Date().toISOString().split('T')[0]; // "2025-07-01"
        }
        return value || '';
    });

    stmt.run(...values, parseInt(id), function(err) {
        if (err) {
            console.error(`Error running ${logPrefix} update statement`, err);
            callback(err);
        } else {
            console.log(`${logPrefix} updated with id: ${id}, changes: ${this.changes}`);
            callback(null, this.changes);
        }
    });

    stmt.finalize();
}

// Specific function mappings
module.exports = {
    saveFormData: (data, callback) => saveData('dental_records', data, [
        'doctor_name', 'patient_name', 'age', 'sex', 'sr_no',
        'date_of_order', 'date_of_delivery', 'stage_fixed',
        'shade', 'selected_teeth', 'instructions'
    ], callback),
    fetchFormData: (callback) => fetchData('dental_records', 'created_at', callback),
    saveMaterialData: (data, callback) => saveData('materials', data, ['name', 'quantity', 'cost', 'date_added'], callback),
    updateMaterialData: (id, data, callback) => updateData('materials', id, data, ['name', 'quantity', 'cost', 'date_added'], callback),
    fetchMaterialData: (callback) => fetchData('materials', 'date_added', callback),
    saveCardData: (data, callback) => saveData('cards', data, ['card_number', 'patient_name', 'expiry_date'], callback),
    fetchCardData: (callback) => fetchData('cards', 'created_at', callback),
    saveChallanData: (data, callback) => saveData('challans', data, ['challan_number', 'patient_name', 'delivery_date', 'status'], callback),
    fetchChallanData: (callback) => fetchData('challans', 'created_at', callback),
    saveExpenseData: (data, callback) => saveData('expenses', data, ['description', 'amount', 'date'], callback),
    fetchExpenseData: (callback) => fetchData('expenses', 'created_at', callback),
    saveNoteData: (data, callback) => saveData('notes', data, ['patient_name', 'doctor_name', 'note_text', 'date_added'], callback),
    fetchNoteData: (callback) => fetchData('notes', 'created_at', callback),
    saveRegistrationData: (data, callback) => saveData('registrations', data, ['patient_name', 'email', 'phone', 'registration_date'], callback),
    fetchRegistrationData: (callback) => fetchData('registrations', 'created_at', callback),
    saveSalaryData: (data, callback) => saveData('salaries', data, ['employee_name', 'amount', 'date_paid'], callback),
    fetchSalaryData: (callback) => fetchData('salaries', 'created_at', callback),
    updateSalaryData: (id, data, callback) => updateData('salaries', id, data, ['employee_name', 'amount', 'date_paid'], callback) // Added
};