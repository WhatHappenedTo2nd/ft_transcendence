import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider} from '@chakra-ui/react';
import MainPage from './components/pages/MainPage';
import ChoicePage from './components/pages/ChoicePage';
import ChattingRoomPage from './components/pages/ChattingRoomPage';
import GamePage from './components/pages/GamePage';
import MyPage from './components/pages/MyPage';
import WaitingRoom from './components/chatting/WaitingRoom';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
          <Routes>
            <Route index element={<MainPage />} />
            <Route path="choice" element={<ChoicePage />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="chattingroom" element={<ChattingRoomPage />} />
            <Route path="game" element={<GamePage />} />
            <Route path="room/:roomId" element={<GamePage />} />
            <Route path="waiting" element={<WaitingRoom />} />
          </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
