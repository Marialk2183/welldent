// Simple static file server for Render (frontend-only)
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

// Serve static files
app.use(express.static(path.join(__dirname, 'html')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve welcome page as root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'welcome.html'));
});

// Serve other HTML pages
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'home.html'));
});

app.get('/patients', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'patients.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'register.html'));
});

app.get('/materials', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'materials.html'));
});

app.get('/note', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'note.html'));
});

app.get('/invoice', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'invoice.html'));
});

app.get('/card', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'card.html'));
});

app.get('/challan', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'challan.html'));
});

app.get('/exp', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'exp.html'));
});

app.get('/salary', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'salary.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Static file server running on port ${port}`);
    console.log(`Visit: http://localhost:${port}`);
});

