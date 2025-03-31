# Lead Generation Tool for Blinds and Painting Services

A comprehensive lead generation platform designed to capture and manage leads for blinds and painting services with geographic targeting capabilities.

## Features

- Geo-targeting with GPS/IP detection
- Multi-platform lead capture (Google Ads, Facebook Lead Ads)
- Product-specific search functionality
- Lead database with CRM integration
- Automated lead qualification
- Local SEO optimization
- Lead nurturing workflow
- Analytics dashboard

## Tech Stack

- Frontend: React.js, Bootstrap
- Backend: Node.js/Express
- Database: MongoDB
- APIs: Facebook Graph API, Google Ads API, Google Maps
- Analytics: Google Analytics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- API keys for:
  - Google Maps
  - Facebook Graph API
  - Google Ads API

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   GOOGLE_ADS_CLIENT_ID=your_google_ads_client_id
   GOOGLE_ADS_CLIENT_SECRET=your_google_ads_client_secret
   ```

4. Start the development server:
   ```bash
   npm run dev:full
   ```

## Project Structure

```
├── client/                 # React frontend
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── .env                   # Environment variables
├── package.json          # Project dependencies
└── README.md            # Project documentation
```

## API Documentation

API documentation is available at `/api-docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

[![Netlify Status](https://api.netlify.com/api/v1/badges/3f5d1bac-df11-4912-be11-143e43df3900/deploy-status)](https://app.netlify.com/sites/eitsa/deploys)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
