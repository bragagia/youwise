# First install

```
nvm install --lts
yarn install
```

Add local env vars:
`/api/.env.local`:

```
OPENAI_API_KEY="your_openai_api_key"
```

# CLEANUP

```
rm -rf node_modules mobile/node_modules api/node_modules web/node_modules shared/node_modules
rm -rf mobile/ios mobile/android

yarn install

cd mobile; yarn expo prebuild --clean
```

# Upgrade all mobile packages

```
yarn expo install expo@latest
expo install --fix
```

# Build

Local build on device: (device needs to be connected via cable)

```
# Optional, to clean the ios and android folders
yarn expo prebuild --clean

yarn expo run:ios --device
```

Cloud builds:

```
nvm use --lts
cd mobile

// Without cache
eas build --platform ios --profile ios-simulator

// With cache
eas build:dev --platform ios --profile ios-simulator

// Local build
eas build --platform ios --profile ios-simulator --local
```

# Launch

```
cd mobile
yarn expo start --clear
```

# Notes

- Auth:
  - AppleAuth:
    - Doesn't work in iOS simulator (wtf Apple)
  - GoogleAuth:
    - Uses this lib: https://react-native-google-signin.github.io/docs/setting-up/expo
    - Need an OAuth client ID from Google Cloud Console here: https://console.cloud.google.com/auth/clients/
  - Once Authorization is obtained, Authentication is done via a custom JWT token
    - Generate tokens with `generate_jwt_token.sh`
