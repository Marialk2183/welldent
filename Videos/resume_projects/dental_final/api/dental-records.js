// Vercel serverless function for dental records
const database = require('../database/database');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Check for search query
      const query = req.query.query || '';
      if (query) {
        // Search functionality
        const db = require('../database/database');
        // Implement search logic here
        return database.fetchFormData((rows) => {
          const filtered = rows.filter(row => 
            row.patient_name?.toLowerCase().includes(query.toLowerCase()) ||
            row.sr_no?.toLowerCase().includes(query.toLowerCase())
          );
          res.json(filtered);
        });
      }
      
      // Fetch all records
      return database.fetchFormData((rows) => res.json(rows));
    }

    if (req.method === 'POST') {
      return database.saveFormData(req.body, (err, id) => {
        if (err) {
          console.error('Error saving dental record:', err);
          return res.status(500).json({ message: 'Error saving dental record' });
        }
        res.json({ message: 'Dental record saved successfully', id });
      });
    }

    if (req.method === 'PUT') {
      const id = req.query.id || req.body.id;
      // Implement update logic
      res.json({ message: 'Update functionality - to be implemented' });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in dental-records API:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

