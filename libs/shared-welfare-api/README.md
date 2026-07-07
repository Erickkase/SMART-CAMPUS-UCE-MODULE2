# @Erickkase/smart-campus-shared-welfare-api

Shared API client and TypeScript types used by the SMART CAMPUS UCE welfare frontend and mobile applications.

Published to GitHub Packages.

## Usage

```bash
npm install @Erickkase/smart-campus-shared-welfare-api
```

```typescript
import { createHttpClient, getScholarships } from '@Erickkase/smart-campus-shared-welfare-api';

const api = createHttpClient({ baseURL: 'https://api.example.com' });
const scholarships = await getScholarships(api);
```

## Build

```bash
npm install
npm run build
```
