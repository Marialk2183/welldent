const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { saveFormData, fetchFormData } = require('./database/database');
const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

// Start Express server
function startServer() {
    const serverPath = path.join(__dirname, 'server.js');
    serverProcess = spawn('node', [serverPath], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    serverProcess.on('error', (err) => {
        console.error('Failed to start server:', err);
    });

    serverProcess.on('exit', (code) => {
        if (code !== null && code !== 0) {
            console.error(`Server process exited with code ${code}`);
        }
    });

    console.log('Express server starting...');
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('html/welcome.html');
}

app.whenReady().then(() => {
    // Start server first, then create window after a short delay
    startServer();
    // Give server time to start before loading the window
    setTimeout(() => {
        createWindow();
    }, 2000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Stop server when app closes
        if (serverProcess) {
            serverProcess.kill();
        }
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle form data saving
ipcMain.on('save-form-data', (event, data) => {
    saveFormData(data);
});

// Handle form data fetching
ipcMain.handle('fetch-form-data', async () => {
    return new Promise((resolve) => {
        fetchFormData((rows) => {
            resolve(rows);
        });
    });
});

// Handle PDF generation
ipcMain.on('convert-to-pdf', async (event, data) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Load the HTML content
        await page.setContent(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .section { margin-bottom: 15px; }
                    .label { font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Welldent Dental Lab Report</h1>
                </div>
                <div class="section">
                    <p><span class="label">Doctor Name:</span> ${data.doctorName}</p>
                    <p><span class="label">Patient Name:</span> ${data.patientName}</p>
                    <p><span class="label">Age:</span> ${data.age}</p>
                    <p><span class="label">Sex:</span> ${data.sex}</p>
                    <p><span class="label">Sr. No:</span> ${data.srNo}</p>
                    <p><span class="label">Date of Order:</span> ${data.dateOfOrder}</p>
                    <p><span class="label">Date of Delivery:</span> ${data.dateOfDelivery}</p>
                    <p><span class="label">Stage Fixed:</span> ${data.stageFixed}</p>
                    <p><span class="label">Shade:</span> ${data.shade}</p>
                    <p><span class="label">Selected Teeth:</span> ${data.selectedTeeth}</p>
                    <p><span class="label">Instructions:</span> ${data.instructions}</p>
                </div>
            </body>
            </html>
        `);

        // Generate PDF
        const pdfPath = path.join(app.getPath('documents'), 'dental-report.pdf');
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true
        });

        await browser.close();
        
        // Notify the renderer that PDF is ready
        event.reply('pdf-generated', pdfPath);
    } catch (error) {
        console.error('Error generating PDF:', error);
        event.reply('pdf-error', error.message);
    }
});
