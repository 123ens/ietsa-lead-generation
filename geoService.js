const axios = require('axios');
const geoip = require('geoip-lite');

class GeoService {
  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  // Get location from IP address
  async getLocationFromIP(ip) {
    try {
      const geo = geoip.lookup(ip);
      if (!geo) {
        throw new Error('Could not determine location from IP');
      }

      // Get detailed address from coordinates using Google Geocoding API
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${geo.ll[0]},${geo.ll[1]}&key=${this.googleMapsApiKey}`
      );

      if (data.results && data.results[0]) {
        const addressComponents = data.results[0].address_components;
        const location = {
          type: 'Point',
          coordinates: [geo.ll[1], geo.ll[0]], // MongoDB uses [longitude, latitude]
          address: data.results[0].formatted_address,
          city: this.getAddressComponent(addressComponents, 'locality'),
          state: this.getAddressComponent(addressComponents, 'administrative_area_level_1'),
          zipCode: this.getAddressComponent(addressComponents, 'postal_code')
        };

        return location;
      }

      throw new Error('Could not get address details from coordinates');
    } catch (error) {
      console.error('Error getting location from IP:', error);
      throw error;
    }
  }

  // Get location from address
  async getLocationFromAddress(address, city, state, zipCode) {
    try {
      const query = `${address}, ${city}, ${state} ${zipCode}`;
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${this.googleMapsApiKey}`
      );

      if (data.results && data.results[0]) {
        const location = data.results[0].geometry.location;
        return {
          type: 'Point',
          coordinates: [location.lng, location.lat],
          address: data.results[0].formatted_address,
          city,
          state,
          zipCode
        };
      }

      throw new Error('Could not find location from address');
    } catch (error) {
      console.error('Error getting location from address:', error);
      throw error;
    }
  }

  // Calculate distance between two points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Helper function to get address component
  getAddressComponent(components, type) {
    const component = components.find(c => c.types.includes(type));
    return component ? component.long_name : '';
  }

  // Validate coordinates
  validateCoordinates(lat, lng) {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  // Get service area for a location
  async getServiceArea(location, radius = 10000) {
    try {
      const { lat, lng } = location;
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.googleMapsApiKey}`
      );

      if (data.results && data.results[0]) {
        const addressComponents = data.results[0].address_components;
        const city = this.getAddressComponent(addressComponents, 'locality');
        const state = this.getAddressComponent(addressComponents, 'administrative_area_level_1');

        return {
          center: location,
          radius,
          city,
          state,
          bounds: this.calculateBounds(lat, lng, radius)
        };
      }

      throw new Error('Could not determine service area');
    } catch (error) {
      console.error('Error getting service area:', error);
      throw error;
    }
  }

  // Calculate bounds for a service area
  calculateBounds(lat, lng, radius) {
    const latChange = (radius / 111320) * (180 / Math.PI);
    const lngChange = (radius / (111320 * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);

    return {
      north: lat + latChange,
      south: lat - latChange,
      east: lng + lngChange,
      west: lng - lngChange
    };
  }
}

module.exports = new GeoService(); 