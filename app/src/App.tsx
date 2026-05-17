import { useState, useCallback } from 'react';
import type { Screen } from './types';
import HomeScreen from './screens/HomeScreen';
import DrawingScreen from './screens/DrawingScreen';
import PhotoScreen from './screens/PhotoScreen';
import ConvertScreen from './screens/ConvertScreen';
import GalleryScreen from './screens/GalleryScreen';
import SettingsScreen from './screens/SettingsScreen';

interface NavData {
  image?: string;
  source?: 'draw' | 'photo';
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [navData, setNavData] = useState<NavData>({});

  const navigate = useCallback((nextScreen: Screen, data?: unknown) => {
    if (data && typeof data === 'object') {
      setNavData(data as NavData);
    }
    setScreen(nextScreen);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#1a0a00]">
      <div className="w-full h-full max-w-lg mx-auto relative">
        {screen === 'home' && <HomeScreen onNavigate={navigate} />}
        {screen === 'draw' && <DrawingScreen onNavigate={navigate} />}
        {screen === 'photo' && <PhotoScreen onNavigate={navigate} />}
        {screen === 'convert' && navData.image && (
          <ConvertScreen image={navData.image} onNavigate={navigate} />
        )}
        {screen === 'gallery' && <GalleryScreen onNavigate={navigate} />}
        {screen === 'settings' && <SettingsScreen onNavigate={navigate} />}
      </div>
    </div>
  );
}
