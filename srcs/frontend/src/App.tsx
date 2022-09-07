import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider} from '@chakra-ui/react';
import MainPage from './components/pages/MainPage';
import ChoicePage from './components/pages/ChoicePage';
import MyPage from './components/pages/MyPage';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
          <Routes>
            <Route index element={<MainPage />} />
            <Route path="choice" element={<ChoicePage />} />
            <Route path="mypage" element={<MyPage />} />
          </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
