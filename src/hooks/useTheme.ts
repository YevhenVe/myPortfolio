import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useTheme = () => {
  const theme = useSelector((state: RootState) => state.theme.value);

  useEffect(() => {
    // Apply a class based on the string value of the topic
    document.body.className = theme === "dark" ? 'theme-dark' : 'theme-light';
}, [theme]);
};
