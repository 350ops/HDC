# Propia - Property Booking Template

Thank you for buying the Propia Booking template!

## Features

- Built with Expo, React Native & Nativewind
- Dark/light mode
- Fully customizable components
- Booking-specific screens and flows similar to Airbnb
- TypeScript 

## Getting Started

```bash
# Use Node.js v20
nvm use 20

# Install dependencies
npm install

# Handle peer dependency issues
npm install --legacy-peer-deps

# Start the Expo development server with a clean cache
npx expo start -c
```


## Prebuild command (important)

Use Expo's prebuild command through npm scripts:

```bash
npm run prebuild
# or
npx expo prebuild
```

> Do **not** run `npx prebuild` in this project. That invokes the separate `prebuild` npm package (node-gyp binary prebuilder), which expects a `binding.gyp` file and fails with `gyp: binding.gyp not found`.
