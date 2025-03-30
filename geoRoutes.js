const express = require('express');
const router = express.Router();
const geoService = require('../services/geoService');
const auth = require('../middleware/auth');

// Get location from IP address
router.get('/ip', auth, async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const location = await geoService.getLocationFromIP(ip);
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get location from address
router.get('/address', auth, async (req, res) => {
  try {
    const { address, city, state, zipCode } = req.query;
    const location = await geoService.getLocationFromAddress(address, city, state, zipCode);
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Calculate distance between two points
router.get('/distance', auth, (req, res) => {
  try {
    const { lat1, lon1, lat2, lon2 } = req.query;
    const distance = geoService.calculateDistance(
      parseFloat(lat1),
      parseFloat(lon1),
      parseFloat(lat2),
      parseFloat(lon2)
    );
    res.json({ distance }); // Distance in meters
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get service area for a location
router.get('/service-area', auth, async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const serviceArea = await geoService.getServiceArea(
      { lat: parseFloat(lat), lng: parseFloat(lng) },
      parseInt(radius) || 10000
    );
    res.json(serviceArea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate coordinates
router.post('/validate-coordinates', auth, (req, res) => {
  try {
    const { lat, lng } = req.body;
    const isValid = geoService.validateCoordinates(parseFloat(lat), parseFloat(lng));
    res.json({ isValid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 