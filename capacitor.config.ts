import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f3828e8cd03243cca31d912f781ace60',
  appName: 'undercover-nomad',
  webDir: 'dist',
  server: {
    url: 'https://f3828e8c-d032-43cc-a31d-912f781ace60.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#0d1117",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#3b82f6",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;