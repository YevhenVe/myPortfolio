import { useState, useEffect } from 'react';

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  const checkNetwork = async () => {
    try {
      await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        cache: 'no-store'
      });
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => checkNetwork();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    checkNetwork(); // Первоначальная проверка

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, checkNetwork };
};

export default useNetworkStatus;