// Create additional tables if they don't exist
// Delivery Salon Table (with payment)
db.run(`CREATE TABLE IF NOT EXISTS delivery_salon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT,
    delivery_date TEXT,
    payment REAL,
    payment_done INTEGER DEFAULT 0
)`, (err) => {
    if (err) {
        console.error('Error creating delivery_salon table', err);
    } else {
        console.log('delivery_salon table created or already exists.');
    }
});
// Salary Table
db.run(`CREATE TABLE IF NOT EXISTS salary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_name TEXT,
    amount REAL,
    date_paid TEXT
)`, (err) => {
    if (err) {
        console.error('Error creating salary table', err);
    } else {
        console.log('salary table created or already exists.');
    }
});
// Expenses Table
db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    amount REAL,
    date TEXT
)`, (err) => {
    if (err) {
        console.error('Error creating expenses table', err);
    } else {
        console.log('expenses table created or already exists.');
    }
});
// Materials Table
db.run(`CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    quantity INTEGER,
    cost REAL,
    date_added TEXT
)`, (err) => {
    if (err) {
        console.error('Error creating materials table', err);
    } else {
        console.log('materials table created or already exists.');
    }
});
// Save Delivery Salon function
function saveDeliverySalon(data) {
    const stmt = db.prepare("INSERT INTO delivery_salon (patient_name, delivery_date, payment) VALUES (?, ?, ?)");
    stmt.run(data.patientName, data.deliveryDate, data.payment, function(err) {
        if (err) {
            console.error('Error saving delivery salon', err);
        } else {
            console.log(`Delivery salon saved with id: ${this.lastID}`);
        }
    });
    stmt.finalize();
}
// Save Salary
function saveSalary(data) {
    const stmt = db.prepare("INSERT INTO salary (employee_name, amount, date_paid) VALUES (?, ?, ?)");
    stmt.run(data.employeeName, data.amount, data.datePaid, function(err) {
        if (err) {
            console.error('Error saving salary', err);
        } else {
            console.log(`Salary saved with id: ${this.lastID}`);
        }
    });
    stmt.finalize();
}
// Save Expense
function saveExpense(data) {
    const stmt = db.prepare("INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)");
    stmt.run(data.description, data.amount, data.date, function(err) {
        if (err) {
            console.error('Error saving expense', err);
        } else {
            console.log(`Expense saved with id: ${this.lastID}`);
        }
    });
    stmt.finalize();
}
// Save Material
function saveMaterial(data) {
    const stmt = db.prepare("INSERT INTO materials (name, quantity, cost, date_added) VALUES (?, ?, ?, ?)");
    stmt.run(data.name, data.quantity, data.cost, data.dateAdded, function(err) {
        if (err) {
            console.error('Error saving material', err);
        } else {
            console.log(`Material saved with id: ${this.lastID}`);
        }
    });
    stmt.finalize();
}
// Fetch Notes (example: fetch notes from dental_records table)
function fetchNotes(callback) {
    db.all("SELECT id, patient_name, doctor_name, date_of_order, date_of_delivery FROM dental_records", (err, rows) => {
        if (err) {
            console.error('Error fetching notes', err);
            callback([]);
        } else {
            callback(rows);
        }
    });
}
// Placeholder for PDF generation (implement with a library like pdfkit or jspdf)
function generateNotesPDF(notes, outputPath) {
    // TODO: Implement PDF generation using a library
    console.log('Generating PDF for notes:', notes);
    // Example: use pdfkit or jspdf here
}
// Search Invoices (example: search by patient_name or id)
function searchInvoices(query, callback) {
    db.all("SELECT * FROM dental_records WHERE patient_name LIKE ? OR id = ?", [`%${query}%`, query], (err, rows) => {
        if (err) {
            console.error('Error searching invoices', err);
            callback([]);
        } else {
            callback(rows);
        }
    });
}
// Search Notes (by patient_name or id)
function searchNotes(query, callback) {
    db.all("SELECT * FROM dental_records WHERE patient_name LIKE ? OR id = ?", [`%${query}%`, query], (err, rows) => {
        if (err) {
            console.error('Error searching notes', err);
            callback([]);
        } else {
            callback(rows);
        }
    });
}
// Search Materials (by name or id)
function searchMaterials(query, callback) {
    db.all("SELECT * FROM materials WHERE name LIKE ? OR id = ?", [`%${query}%`, query], (err, rows) => {
        if (err) {
            console.error('Error searching materials', err);
            callback([]);
        } else {
            callback(rows);
        }
    });
}
// Search Salary (by employee_name or id)
function searchSalary(query, callback) {
    db.all("SELECT * FROM salary WHERE employee_name LIKE ? OR id = ?", [`%${query}%`, query], (err, rows) => {
        if (err) {
            console.error('Error searching salary', err);
            callback([]);
        } else {
            callback(rows);
        }
    });
}
// Update Salary
function updateSalary(id, data, callback) {
    db.run("UPDATE salary SET employee_name = ?, amount = ?, date_paid = ? WHERE id = ?", [data.employeeName, data.amount, data.datePaid, id], function(err) {
        if (err) {
            console.error('Error updating salary', err);
            callback(false);
        } else {
            callback(true);
        }
    });
}
// Search Expenses (by description or id)
function searchExpenses(query, callback) {
    db.all("SELECT * FROM expenses WHERE description LIKE ? OR id = ?", [`%${query}%`, query], (err, rows) => {
        if (err) {
            console.error('Error searching expenses', err);
            callback([]);
        } else {
            callback(rows);
        }
    });
}
// Search Delivery Salon (by patient_name or id)
function searchDeliverySalon(query, callback) {
    db.all("SELECT * FROM delivery_salon WHERE patient_name LIKE ? OR id = ?", [`%${query}%`, query], (err, rows) => {
        if (err) {
            console.error('Error searching delivery salon', err);
            callback([]);
        } else {
            callback(rows);
        }
    });
}
// Update Delivery Salon Payment and Payment Done
function updateDeliverySalonPayment(id, payment, payment_done, callback) {
    db.run("UPDATE delivery_salon SET payment = ?, payment_done = ? WHERE id = ?", [payment, payment_done, id], function(err) {
        if (err) {
            console.error('Error updating delivery salon payment', err);
            callback(false);
        } else {
            callback(true);
        }
    });
}
module.exports = { saveFormData, fetchFormData, saveDeliverySalon, saveSalary, saveExpense, saveMaterial, fetchNotes, generateNotesPDF, searchInvoices, searchNotes, searchMaterials, searchSalary, updateSalary, searchExpenses, searchDeliverySalon, updateDeliverySalonPayment }; 