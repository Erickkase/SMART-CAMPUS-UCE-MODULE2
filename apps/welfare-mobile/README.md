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

For AWS deployments, point the variable to the gateway DNS or NLB endpoint, for example:

```env
EXPO_PUBLIC_API_GATEWAY_URL=https://your-domain.com/api
```

## Authentication

The login screen is currently a mock: any email and password are accepted and a placeholder token is stored. The token is automatically attached to every API request via an Axios request interceptor, so the app is ready once the centralized authentication service (ACT-009) is implemented.

On Android and iOS the token is persisted with `expo-secure-store`. On web it falls back to `localStorage` so the exported bundle can still be previewed.

## Screens

- Login
- Dashboard
- Scholarships list / detail / create
- Socioeconomic forms list / detail / create / edit / search by studentId

## Build for Android / AWS

### Expo Go (development)

```bash
npm run start
# Scan the QR code with Expo Go on your Android device
```

### Web preview

```bash
npm run build:web
```

### Production APK/AAB

To generate a signed Android artifact you need either [EAS Build](https://docs.expo.dev/build/setup/) or a local Android Studio prebuild:

```bash
# EAS Build (requires an Expo account configured)
npx eas build --platform android

# Local prebuild (requires Android SDK)
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

## Quality checks

```bash
# Type check application code
npm run typecheck

# Type check test files
npm run typecheck:test

# Lint
npm run lint

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch
```
