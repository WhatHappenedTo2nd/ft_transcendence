import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider} from '@chakra-ui/react';
import MainPage from './components/pages/MainPage';
import ChoicePage from './components/pages/ChoicePage';
<<<<<<< HEAD
import MyPage from './components/pages/MyPage';
import ChattingPage from './components/pages/ChattingPage';
=======
import ChattingRoomPage from './components/pages/ChattingRoomPage';
>>>>>>> e9e000f09c75f1ad985b397d500b5c0f185012ce
import GamePage from './components/pages/GamePage';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
          <Routes>
            <Route index element={<MainPage />} />
            <Route path="choice" element={<ChoicePage />} />
<<<<<<< HEAD
            <Route path="mypage" element={<MyPage />} />
            <Route path="chatting" element={<ChattingPage />} />
=======
            <Route path="chattingroom" element={<ChattingRoomPage />} />
>>>>>>> e9e000f09c75f1ad985b397d500b5c0f185012ce
            <Route path="game" element={<GamePage />} />
          </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
