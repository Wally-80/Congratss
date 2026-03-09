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
};

export default config;
