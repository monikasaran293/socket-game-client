import React, { useEffect, createContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, styled } from '@mui/material';
import socketClient from "socket.io-client";
import SideNav from '../components/side.nav';
import Header from '../components/header';
import Footer from '../components/footer';
import GameRoom from '../components/game.room';
import LoginDialog from '../components/login.dialog';
import { getRooms, joinRoom, loginUser } from '../app/action';

const StyledRoomWrapper = styled(Grid)`
  height: calc(100vh - 144px);
`
export const SocketContext = createContext()

const Home = () => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null)
  const { user } = useSelector((state) => state.playReducer);
  const [selectedRoom, setSelectedRoom] = useState({})

  useEffect(() => {
    dispatch(getRooms())
    setSocket(socketClient("ws://localhost:8082"))
    return () => {
      socket.off('message')
      socket.off('error')
      socket.emit('disconnect')
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('message', (msg) => {
        console.log("Message Event", msg);
        msg.socketId && dispatch(loginUser(msg))
        msg.room && dispatch(joinRoom(msg.room))
      });

      socket.on('error', (err) => {
        console.error("Error Event", err);
      })
    }
  }, [socket])

  useEffect(() => {
    if (selectedRoom.name) {
      const { name, type } = selectedRoom
      socket.emit('joinRoom', {
        username: user.user,
        room: name,
        roomType: type
      })
    }
  }, [selectedRoom])

  const unsubscribeEvents = () => {
    socket.off('activateYourTurn')
    socket.off('randomNumber')
    socket.off('gameOver')
    socket.off('onReady')
  }

  return socket ? (
    <SocketContext.Provider value={{ socket, unsubscribeEvents }}>
      <Box>
        <LoginDialog />
        <Header />
        <StyledRoomWrapper container>
          <Grid item xs={4}>
            <SideNav selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
          </Grid>
          <Grid item xs={8}>
            <GameRoom selectedRoom={selectedRoom} />
          </Grid>
        </StyledRoomWrapper>
        <Footer />
      </Box>
    </SocketContext.Provider>
  ) : null;
}

export default Home
