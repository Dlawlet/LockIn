import "dotenv/config";

export default {
  expo: {
    name: "LockIn",
    slug: "LockIn",
    owner: "nakira",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "lockin",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.hwork.LockIn",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.hwork.LockIn",
      versionCode: 1
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      EXPO_CLIENT_ID: process.env.EXPO_CLIENT_ID,
      IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,
      ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
      WEB_CLIENT_ID: process.env.WEB_CLIENT_ID,
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
       "expo-dev-client",
      [
        "@react-native-google-signin/google-signin",
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
};
