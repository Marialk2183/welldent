const express = require('express');
const database = require('./database/database'); // Load the entire object
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors'); // Add CORS support
const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database for serial counter and other tables
const db = new sqlite3.Database('dental.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS serial_counter (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            last_serial INTEGER
        )`, (err) => {
            if (err) {
                console.error('Error creating serial_counter table:', err);
            } else {
                db.get('SELECT last_serial FROM serial_counter WHERE id = 1', (err, row) => {
                    if (!row) {
                        db.run('INSERT INTO serial_counter (id, last_serial) VALUES (1, 0)');
                    }
                });
            }
        });
    }
});

// Invoices API
app.get('/api/serial', (req, res) => {
    db.get('SELECT last_serial FROM serial_counter WHERE id = 1', (err, row) => {
        if (err) {
            console.error('Error fetching serial number:', err);
            return res.status(500).json({ message: 'Error fetching serial number' });
        }
        const serialNo = row ? row.last_serial + 1 : 1;
        res.json({ serialNo: `INV${String(serialNo).padStart(4, '0')}` });
    });
});

app.post('/api/invoices', (req, res) => {
    const { serial, date, invoice, price, description } = req.body;

    if (!serial.match(/^INV\d{4}$/)) {
        return res.status(400).json({ message: 'Invalid serial number format' });
    }

    const serialNum = parseInt(serial.replace('INV', ''));
    db.get('SELECT last_serial FROM serial_counter WHERE id = 1', (err, row) => {
        if (err) {
            console.error('Error checking serial number:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        const lastSerial = row ? row.last_serial : 0;
        if (serialNum !== lastSerial + 1) {
            return res.status(400).json({ message: 'Serial number mismatch' });
        }

        db.run('INSERT INTO invoices (serial, date, invoice_number, price, description) VALUES (?, ?, ?, ?, ?)',
            [serial, date, invoice, price, description], function(err) {
                if (err) {
                    console.error('Error saving invoice:', err);
                    return res.status(500).json({ message: 'Error saving invoice' });
                }
                db.run('UPDATE serial_counter SET last_serial = ? WHERE id = 1', [serialNum], (err) => {
                    if (err) {
                        console.error('Error updating serial number:', err);
                    }
                    res.json({ message: 'Invoice saved successfully' });
                });
            });
    });
});

app.get('/api/invoices/search', (req, res) => {
    const query = req.query.query || '';
    db.all('SELECT * FROM invoices WHERE serial LIKE ? OR invoice_number LIKE ?', [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            console.error('Error searching invoices:', err);
            return res.status(500).json({ message: 'Error searching invoices' });
        }
        res.json(rows);
    });
});

// Dental records API
app.post('/api/dental-records', (req, res) => {
    database.saveFormData(req.body, (err, id) => {
        if (err) {
            console.error('Error saving dental record:', err);
            return res.status(500).json({ message: 'Error saving dental record' });
        }
        res.json({ message: 'Dental record saved successfully', id });
    });
});

app.get('/api/dental-records', (req, res) => {
    database.fetchFormData((rows) => res.json(rows));
});

app.put('/api/dental-records/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    db.run(
        `UPDATE dental_records SET doctor_name = ?, patient_name = ?, date_of_order = ?, date_of_delivery = ?, 
         selected_teeth = ?, stage_fixed = ?, shade = ?, instructions = ? WHERE sr_no = ?`,
        [data.doctor_name, data.patient_name, data.date_of_order, data.date_of_delivery, data.selected_teeth,
         data.stage_fixed, data.shade, data.instructions, id],
        function(err) {
            if (err) {
                console.error('Error updating dental record:', err);
                return res.status(500).json({ message: 'Error updating dental record' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Record not found' });
            }
            res.json({ message: 'Dental record updated successfully', changes: this.changes });
        }
    );
});

app.get('/api/dental-records/search', (req, res) => {
    const query = req.query.query || '';
    db.all('SELECT * FROM dental_records WHERE patient_name LIKE ? OR sr_no LIKE ?', [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            console.error('Error searching dental records:', err);
            return res.status(500).json({ message: 'Error searching dental records' });
        }
        res.json(rows);
    });
});

app.post('/api/generate-pdf', async (req, res) => {
    const { no, date, doctor, patient, delivery, tooth, instructions, shade, trial, notes } = req.body;

    try {
        // Map tooth numbers to quadrants based on the received tooth array
        const teethMap = {
            'Upper Left': tooth && tooth.length > 0 ? tooth.filter(t => ['Upper Left'].some(q => req.body.selected_teeth && req.body.selected_teeth.includes(`${q} ${t}`))).join(' ') : '',
            'Upper Right': tooth && tooth.length > 0 ? tooth.filter(t => ['Upper Right'].some(q => req.body.selected_teeth && req.body.selected_teeth.includes(`${q} ${t}`))).join(' ') : '',
            'Lower Left': tooth && tooth.length > 0 ? tooth.filter(t => ['Lower Left'].some(q => req.body.selected_teeth && req.body.selected_teeth.includes(`${q} ${t}`))).join(' ') : '',
            'Lower Right': tooth && tooth.length > 0 ? tooth.filter(t => ['Lower Right'].some(q => req.body.selected_teeth && req.body.selected_teeth.includes(`${q} ${t}`))).join(' ') : ''
        };

        // Construct HTML content based on note.html structure
        const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dental Lab Note</title>
    <style>
        * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        }

        body {
        font-family: 'Arial', sans-serif;
        background: #f4f4f4;
        }

        .note-form {
        background: #fff;
        padding: 10mm;
        border-radius: 6px;
        border: 2px solid #333;
        width: 105mm;
        height: 148.5mm;
        margin: 10mm auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 6px;
        }

        .form-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 12px;
        gap: 6px;
        }

        .form-row label {
        width: 40%;
        font-weight: bold;
        color: #04113e;
        }

        .form-row input,
        .form-row textarea {
        flex: 1;
        padding: 3px 6px;
        font-size: 11px;
        border: 1px solid #0b76d3;
        border-radius: 4px;
        width: 100%;
        resize: none;
        }

        .section-title {
        margin-top: 6px;
        font-size: 13px;
        font-weight: bold;
        border-bottom: 1px solid #ccc;
        padding-bottom: 2px;
        color: #04113e;
        }

        .tooth-display {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 11px;
        }

        .quadrant-pair {
        display: flex;
        gap: 8px;
        }

        .quadrant {
        display: flex;
        flex-direction: column;
        }

        .quadrant-label {
        font-weight: bold;
        margin-bottom: 2px;
        }

        .teeth-list {
        font-size: 11px;
        color: #04113e;
        }

        textarea {
        height: 30px;
        }

        footer {
        font-size: 10px;
        text-align: center;
        color: #999;
        margin-top: auto;
        padding-top: 6px;
        }
    </style>
    </head>
    <body>
    <form class="note-form" id="dentalNoteForm">
        <div class="form-row">
        <label for="no">No.</label>
        <input type="text" id="no" name="no" value="${no || ''}" readonly />
        </div>
        <div class="form-row">
        <label for="date">Date</label>
        <input type="text" id="date" name="date" value="${date || ''}" readonly />
        </div>
        <div class="form-row">
        <label for="doctor">Doctor's Name</label>
        <input type="text" id="doctor" name="doctor" value="${doctor || ''}" readonly />
        </div>
        <div class="form-row">
        <label for="patient">Patient Name</label>
        <input type="text" id="patient" name="patient" value="${patient || ''}" readonly />
        </div>
        <div class="form-row">
        <label for="delivery">Delivery Date</label>
        <input type="text" id="delivery" name="delivery" value="${delivery || ''}" readonly />
        </div>

        <div class="section-title">Tooth Numbers</div>
        <div class="tooth-display">
        <div class="quadrant-pair">
            <div class="quadrant">
            <span class="quadrant-label">Upper Left</span>
            <span class="teeth-list" id="upperLeftTeeth">${teethMap['Upper Left'] || ''}</span>
            </div>
            <div class="quadrant">
            <span class="quadrant-label">Upper Right</span>
            <span class="teeth-list" id="upperRightTeeth">${teethMap['Upper Right'] || ''}</span>
            </div>
        </div>
        <div class="quadrant-pair">
            <div class="quadrant">
            <span class="quadrant-label">Lower Left</span>
            <span class="teeth-list" id="lowerLeftTeeth">${teethMap['Lower Left'] || ''}</span>
            </div>
            <div class="quadrant">
            <span class="quadrant-label">Lower Right</span>
            <span class="teeth-list" id="lowerRightTeeth">${teethMap['Lower Right'] || ''}</span>
            </div>
        </div>
        </div>

        <div class="section-title">Instructions</div>
        <div class="form-row">
        <input type="text" value="${Array.isArray(instructions) ? instructions.join(', ') : instructions || ''}" readonly />
        </div>

        <div class="section-title">Tooth Shade</div>
        <div class="form-row">
        <input type="text" value="${shade || ''}" readonly />
        </div>

        <div class="section-title">Trial Type</div>
        <div class="form-row">
        <input type="text" value="${Array.isArray(trial) ? trial.join(', ') : trial || ''}" readonly />
        </div>

        <div class="section-title">Additional Notes</div>
        <div class="form-row">
        <textarea readonly>${notes || ''}</textarea>
        </div>

    </form>
    </body>
    </html>
`;

        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=dental_note_${no || 'unknown'}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
    }
});

app.post('/api/materials', (req, res) => {
    database.saveMaterialData(req.body, (err, id) => {
        if (err) return res.status(500).json({ message: 'Error saving material', error: err.message });
        res.json({ message: 'Material saved successfully', id });
    });
});

app.put('/api/materials/:id', (req, res) => {
    const id = req.params.id;
    database.updateMaterialData(id, req.body, (err, changes) => {
        if (err) return res.status(500).json({ message: 'Error updating material', error: err.message });
        if (changes === 0) return res.status(404).json({ message: 'Material not found' });
        res.json({ message: 'Material updated successfully', id });
    });
});

app.get('/api/materials', (req, res) => {
    database.fetchMaterialData((rows) => {
        res.json(rows);
    });
});

app.get('/api/materials/search', (req, res) => {
    const query = req.query.query || '';
    db.all('SELECT * FROM materials WHERE name LIKE ? OR id = ?', [`%${query}%`, query], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error searching materials', error: err.message });
        res.json(rows);
    });
});

// Cards API
app.post('/api/cards', (req, res) => {
    database.saveCardData(req.body, (err, id) => {
        if (err) {
            console.error('Error saving card:', err);
            return res.status(500).json({ message: 'Error saving card' });
        }
        res.json({ message: 'Card saved successfully', id });
    });
});

app.get('/api/cards', (req, res) => {
    database.fetchCardData((rows) => res.json(rows));
});

app.get('/api/cards/search', (req, res) => {
    const query = req.query.query || '';
    db.all('SELECT * FROM cards WHERE patient_name LIKE ? OR card_number LIKE ?', [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            console.error('Error searching cards:', err);
            return res.status(500).json({ message: 'Error searching cards' });
        }
        res.json(rows);
    });
});

// Challans API
app.post('/api/challans', (req, res) => {
    database.saveChallanData(req.body, (err, id) => {
        if (err) {
            console.error('Error saving challan:', err);
            return res.status(500).json({ message: 'Error saving challan' });
        }
        res.json({ message: 'Challan saved successfully', id });
    });
});

app.get('/api/challans', (req, res) => {
    database.fetchChallanData((rows) => res.json(rows));
});

app.get('/api/challans/search', (req, res) => {
    const query = req.query.query || '';
    db.all('SELECT * FROM challans WHERE patient_name LIKE ? OR challan_number LIKE ?', [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            console.error('Error searching challans:', err);
            return res.status(500).json({ message: 'Error searching challans' });
        }
        res.json(rows);
    });
});

// Expenses API
app.post('/api/expenses', (req, res) => {
    database.saveExpenseData(req.body, (err, id) => {
        if (err) {
            console.error('Error saving expense:', err);
            return res.status(500).json({ message: 'Error saving expense' });
        }
        res.json({ message: 'Expense saved successfully', id });
    });
});

app.get('/api/expenses', (req, res) => {
    database.fetchExpenseData((rows) => res.json(rows));
});

app.get('/api/expenses/search', (req, res) => {
    const query = req.query.query || '';
    db.all('SELECT * FROM expenses WHERE description LIKE ? OR id = ?', [`%${query}%`, query], (err, rows) => {
        if (err) {
            console.error('Error searching expenses:', err);
            return res.status(500).json({ message: 'Error searching expenses' });
        }
        res.json(rows);
    });
});

// Notes API
app.post('/api/notes', (req, res) => {
    database.saveNoteData(req.body, (err, id) => {
        if (err) {
            console.error('Error saving note:', err);
            return res.status(500).json({ message: 'Error saving note' });
        }
        res.json({ message: 'Note saved successfully', id });
    });
});

app.get('/api/notes', (req, res) => {
    database.fetchNoteData((rows) => res.json(rows));
});

app.get('/api/notes/search', (req, res) => {
    const query = req.query.query || '';
    db.all('SELECT * FROM notes WHERE patient_name LIKE ? OR doctor_name LIKE ?', [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            console.error('Error searching notes:', err);
            return res.status(500).json({ message: 'Error searching notes' });
        }
        res.json(rows);
    });
});

// Registrations API
app.post('/api/registrations', (req, res) => {
    database.saveRegistrationData(req.body, (err, id) => {
        if (err) {
            console.error('Error saving registration:', err);
            return res.status(500).json({ message: 'Error saving registration' });
        }
        res.json({ message: 'Registration saved successfully', id });
    });
});

app.get('/api/registrations', (req, res) => {
    database.fetchRegistrationData((rows) => res.json(rows));
});

app.get('/api/registrations/search', (req, res) => {
    const query = req.query.query || '';
    db.all('SELECT * FROM registrations WHERE patient_name LIKE ? OR email LIKE ?', [`%${query}%`, `%${query}%`], (err, rows) => {
        if (err) {
            console.error('Error searching registrations:', err);
            return res.status(500).json({ message: 'Error searching registrations' });
        }
        res.json(rows);
    });
});

// Salaries API
app.post('/api/salaries', (req, res) => {
    const { employee_name, amount, date_paid, end_date } = req.body;

    // Validate required fields
    if (!employee_name || amount === undefined || !date_paid) {
        return res.status(400).json({ message: 'Missing required fields: employee_name, amount, and date_paid are required' });
    }

    // Validate and sanitize date_paid
    const datePaid = new Date(date_paid);
    if (isNaN(datePaid.getTime()) || datePaid.getFullYear() < 1000 || datePaid.getFullYear() > 9999) {
        return res.status(400).json({ message: 'Invalid date_paid. Use YYYY-MM-DD between 1000 and 9999' });
    }

    // Prepare payload
    const payload = {
        employee_name,
        amount: parseFloat(amount) || 0,
        date_paid: datePaid.toISOString().split('T')[0],
        end_date: end_date ? new Date(end_date).toISOString().split('T')[0] : null
    };

    database.saveSalaryData(payload, (err, id) => {
        if (err) {
            console.error('Error saving salary:', err);
            return res.status(500).json({ message: 'Error saving salary', error: err.message });
        }
        res.status(201).json({ message: 'Salary saved successfully', id });
    });
});

app.get('/api/salaries', (req, res) => {
    database.fetchSalaryData((rows) => {
        res.json(rows);
    });
});

app.put('/api/salaries/:id', (req, res) => {
    const id = req.params.id;
    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ message: 'Invalid id. Must be a positive integer' });
    }

    const { employee_name, amount, date_paid, end_date } = req.body;
    if (!employee_name && amount === undefined && !date_paid) {
        return res.status(400).json({ message: 'At least one field (employee_name, amount, or date_paid) is required for update' });
    }

    const datePaid = date_paid ? new Date(date_paid) : null;
    if (date_paid && (isNaN(datePaid.getTime()) || datePaid.getFullYear() < 1000 || datePaid.getFullYear() > 9999)) {
        return res.status(400).json({ message: 'Invalid date_paid. Use YYYY-MM-DD between 1000 and 9999' });
    }

    const payload = {
        employee_name,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        date_paid: date_paid ? datePaid.toISOString().split('T')[0] : undefined,
        end_date: end_date ? new Date(end_date).toISOString().split('T')[0] : undefined
    };

    database.updateSalaryData(id, payload, (err, changes) => {
        if (err) {
            console.error('Error updating salary:', err);
            return res.status(500).json({ message: 'Error updating salary', error: err.message });
        }
        if (changes === 0) {
            return res.status(404).json({ message: 'Salary record not found' });
        }
        res.json({ message: 'Salary updated successfully', id });
    });
});

app.get('/api/salaries/search', (req, res) => {
    const searchTerm = req.query.search || '';
    db.all('SELECT * FROM salaries WHERE employee_name LIKE ? OR CAST(id AS TEXT) LIKE ?', [`%${searchTerm}%`, `%${searchTerm}%`], (err, rows) => {
        if (err) {
            console.error('Error searching salaries:', err);
            return res.status(500).json({ message: 'Error searching salaries', error: err.message });
        }
        res.json(rows);
    });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = db; // Keep this for potential external use, though not recommended with multiple db instances