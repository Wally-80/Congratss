import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.congratss.app",
    appName: "Congratss",
    webDir: "out",
    backgroundColor: "#030308",
    android: {
        allowMixedContent: false,
    },
    ios: {
        contentInset: "automatic",
    },
    plugins: {
        SplashScreen: {
            launchAutoHide: true,
            launchShowDuration: 2000,
            backgroundColor: "#030308",
            showSpinner: false,
            splashImmersive: true,
            splashFullScreen: true,
        },
    },
    // Uncomment for production builds pointing to live site:
    // server: {
    //     url: "https://congratss.com",
    // },
};

export default config;
