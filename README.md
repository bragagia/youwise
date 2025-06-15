First install:

```
nvm install --lts
yarn install
```

Add local env vars:
`/api/.env.local`:

```
OPENAI_API_KEY="your_openai_api_key"
```

Build:

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

Launch:

```
cd mobile
npx expo start --clear
```

Notes:

- Apple Login doesn't work in iOS simulator (at least on a dev build)
- Auth:
  - AppleAuth:
    - Doesn't work in iOS simulator (wtf Apple)
  - GoogleAuth:
    - Uses this lib: https://react-native-google-signin.github.io/docs/setting-up/expo
    - Need an OAuth client ID from Google Cloud Console here: https://console.cloud.google.com/auth/clients/
    -
  - Once Authorization is obtained, Authentication is done via a custom JWT token
    - Generate tokens with `generate_jwt_token.sh`
