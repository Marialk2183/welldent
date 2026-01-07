// Vercel serverless function - Main API handler
const database = require('../database/database');
const sqlite3 = require('sqlite3').verbose();

// Note: For Vercel, you'll need to use a cloud database
// SQLite file-based DB won't work in serverless environment
// Consider using: Vercel Postgres, Supabase, or PlanetScale

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, url } = req;
  const path = url.split('?')[0];

  try {
    // Route to appropriate handler
    if (path === '/api/dental-records' && method === 'GET') {
      return database.fetchFormData((rows) => res.json(rows));
    }
    
    if (path === '/api/dental-records' && method === 'POST') {
      return database.saveFormData(req.body, (err, id) => {
        if (err) {
          return res.status(500).json({ message: 'Error saving dental record' });
        }
        res.json({ message: 'Dental record saved successfully', id });
      });
    }

    // Add more routes as needed
    res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

