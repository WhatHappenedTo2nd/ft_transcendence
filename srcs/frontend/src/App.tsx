import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider} from '@chakra-ui/react';
import MainPage from './components/pages/MainPage';
import ChoicePage from './components/pages/ChoicePage';
import ChattingRoomPage from './components/pages/ChattingRoomPage';
import GamePage from './components/pages/GamePage';
import WaitingRoom from './components/chatting/WaitingRoom';
import MyPage from './components/pages/MyProfilePage';
import { io } from 'socket.io-client';
import UserProfile from './components/mypage/UserProfile';

export const socket = io('http://localhost:9633/api/chat');

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
            <Route path="room/:roomName" element={<GamePage />} />
            <Route path="waiting" element={<WaitingRoom />} />
            <Route path="profile/:nickname" element={<UserProfile />} />
          </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
