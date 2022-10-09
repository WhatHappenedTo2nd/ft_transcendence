import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Switch} from '@chakra-ui/react';
import MainPage from './components/pages/MainPage';
import { io } from 'socket.io-client';
import HomePage from './components/pages/HomePage';

export const socket = io('http://localhost:9633/api/chat');

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
          <Routes>
              <Route index element={<MainPage />} />
              <Route path="/*" element={<HomePage />} />
          </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
