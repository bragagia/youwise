First install:

```
nvm install --lts
yarn install
```

Build:

```
nvm use --lts
cd mobile
eas build --platform ios --profile ios-simulator
// or, to better see the logs
eas build --platform ios --profile ios-simulator --local
```

Launch:

```
cd mobile
npx expo start
```
