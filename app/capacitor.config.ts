import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ukiyoe.artapp',
  appName: '浮世絵アート',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#1a0a00',
  },
  plugins: {
    Camera: {
      presentationStyle: 'popover',
    },
  },
};

export default config;
