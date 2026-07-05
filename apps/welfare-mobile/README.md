# Welfare Mobile

Mobile application for the SMART CAMPUS UCE Welfare module.

## Tech stack

- React Native
- Expo
- Expo Router
- TypeScript
- Axios

## Setup

```bash
cd apps/welfare-mobile
cp .env.example .env
npm install
```

## Run locally

```bash
# Start Expo dev server
npm run start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web
```

## API configuration

The mobile app communicates through the API Gateway. Update `EXPO_PUBLIC_API_GATEWAY_URL` in your `.env` file:

```env
EXPO_PUBLIC_API_GATEWAY_URL=http://localhost:8080/api
```

## Screens

- Login
- Dashboard
- Scholarships list / detail / create
- Socioeconomic forms list / detail / create
