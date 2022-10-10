import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import MainPage from './components/pages/MainPage';
import { io } from 'socket.io-client';
import HomePage from './components/pages/HomePage';
import { useEffect, useState } from 'react';
import { getCookie } from './api/cookieFunc';
import NotFound from './components/pages/NotFound';

export const socket = io('http://localhost:9633/api/chat');

function App() {
  const [login, setLogin] = useState(true);
  useEffect(() => {
    if (!getCookie("accessToken")) {
      setLogin(false);
    }
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ChakraProvider>
      <BrowserRouter>
          <Routes>
            <Route index element={<MainPage />} />
            {login ? <Route path="/*" element={<HomePage />} /> : <Route path="/*" element={<NotFound />} />}
          </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
