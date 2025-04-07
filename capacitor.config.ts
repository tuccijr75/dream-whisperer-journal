
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ad11d2cff70942aabb50954f2fff313b',
  appName: 'Dream Whisperer',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://ad11d2cf-f709-42aa-bb50-954f2fff313b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#121d42",
      showSpinner: true,
      spinnerColor: "#f0e6cf",
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  ios: {
    contentInset: "always",
    scheme: "dream-whisperer",
    backgroundColor: "#121d42"
  },
  android: {
    backgroundColor: "#121d42"
  }
};

export default config;
