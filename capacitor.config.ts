
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
      backgroundColor: "#f8f9ff",
      showSpinner: true,
      spinnerColor: "#9b87f5",
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  ios: {
    contentInset: "always"
  },
  android: {
    backgroundColor: "#f8f9ff"
  }
};

export default config;
