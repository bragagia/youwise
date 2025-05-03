First install:

```
nvm install --lts
yarn install
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
npx expo start
```
