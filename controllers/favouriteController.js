const db = require('../config/db');

const getAllProperties = (req, res) => {
  db.all('SELECT * FROM properties ORDER BY id', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(rows);
  });
};

const getFavourites = (req, res) => {
  const userId = req.user.id;
  db.all(`
    SELECT p.* FROM properties p
    JOIN favourites f ON p.id = f.property_id
    WHERE f.user_id = ?
  `, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(rows);
  });
};

const addFavourite = (req, res) => {
  const userId = req.user.id;
  const { propertyId } = req.body;

  if (!propertyId) return res.status(400).json({ message: 'Property ID is required' });

  db.get('SELECT id FROM properties WHERE id = ?', [propertyId], (err, prop) => {
    if (err || !prop) return res.status(404).json({ message: 'Property not found' });

    db.run('INSERT INTO favourites (user_id, property_id) VALUES (?, ?)', [userId, propertyId], function (err) {
      if (err && err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'Already in your favourites' });
      }
      if (err) return res.status(500).json({ message: 'Server error' });
      res.status(201).json({ message: 'Added to favourites' });
    });
  });
};

const removeFavourite = (req, res) => {
  const userId = req.user.id;
  const { propertyId } = req.body;

  if (!propertyId) return res.status(400).json({ message: 'Property ID is required' });

  db.run('DELETE FROM favourites WHERE user_id = ? AND property_id = ?', [userId, propertyId], function (err) {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (this.changes === 0) return res.status(404).json({ message: 'Favourite not found' });
    res.json({ message: 'Removed from favourites' });
  });
};

module.exports = { getAllProperties, getFavourites, addFavourite, removeFavourite };