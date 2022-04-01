import { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Button,
  Typography
} from "@mui/material"
import { makeStyles } from "@mui/styles";

import { ReactComponent as UserIcon } from "../assets/logo.svg";
import { ReactComponent as PlayerIcon } from "../assets/player.svg"
import { ReactComponent as WinIcon } from "../assets/win.svg"
import { ReactComponent as LoseIcon } from "../assets/lose.svg"

import { SocketContext } from '../pages/home';

const useStyles = makeStyles({
  root: {
    position: 'relative'
  },
  modal: {
    position: 'absolute',
    display: 'flex',
    width: '100%',
    height: '100%',
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    margin: '20% auto',
    zIndex: 9
  },
  modalIcon: {
    display: 'flex',
    justifyContent: 'center'
  },
  gameOverText: {
    padding: 16,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 41,
    color: '#FFFFFF'
  },
  newGame: {
    padding: '16px 80px',
    background: '#FFFFFF',
    borderRadius: 28,
    fontWeight: 700,
    fontSize: 16,
    textAlign: 'center',
    color: '#1574F5',
    '&:hover': {
      background: '#FFFFFF',
    }
  },
  playerInput: {
    display: 'flex',
    marginBottom: 40,
  },
  firstPlayer: {
    '&:nth-child(odd)': {
      '&>div': {
        backgroundColor: '#205A6D'
      }
    },
    '&:nth-child(even)': {
      flexDirection: 'row-reverse',
      '&>div': {
        backgroundColor: '#1574F5'
      }
    }
  },
  secondPlayer: {
    '&:nth-child(even)': {
      '&>div': {
        backgroundColor: '#205A6D'
      }
    },
    '&:nth-child(odd)': {
      flexDirection: 'row-reverse',
      '&>div': {
        backgroundColor: '#1574F5'
      }
    }
  },
  selectedNumber: {
    margin: '0 16px',
    display: 'flex',
    fontWeight: 700,
    fontSize: 24,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 28
  },
  playRoom: {
    padding: '32px 16px 16px',
    width: '90%',
    overflow: 'auto',
    height: 'calc(100vh - 193px)',
    background: '#FFFFFF',
    position: 'relative'
  },
  buttonWrapper: {
    bottom: 90,
    right: '25%',
    position: 'fixed',
    transform: 'translate(0, -25%)'
  },
  inputWrapper: {
  },
  playButton: {
    margin: 10,
    boxShadow: '0px 1px 3px 2px rgb(0 0 0 / 15%)',
    height: 64,
    borderRadius: '50%'
  },
  messageText: {
    textAlign: 'center',
    backgroundColor: '#e4e2e2',
    borderRadius: 2,
    padding: '5px 40px',
    fontWeight: 600,
    margin: '20px 0'
  }
})

const ACTIONS = [-1, 0, 1]
const GameRoom = () => {
  const classes = useStyles()
  const { socket, unsubscribeEvents } = useContext(SocketContext)
  const { rooms, user } = useSelector((state) => state.playReducer);

  const [result, setResult] = useState([])
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [number, setNumber] = useState(null)
  const [turn, setTurn] = useState({});
  const [gameOver, setGameOver] = useState({})
  const [isReady, setIsReady] = useState(false)
  const [isFirstUser, setIsFirstUser] = useState(null)

  useEffect(() => {
    return () => {
      unsubscribeEvents()
    }
  }, [])

  useEffect(() => {
    resetState()
    unsubscribeEvents()
    if (user?.room) {
      subscibeEvents()
    }
  }, [user?.room])

  useEffect(() => {
    resetState()
    if (user.room) {
      resetState()
      socket.emit('letsPlay', {})
    }
    if (user.room?.type === 'cpu') {
      setIsFirstUser(user.socketId)
    } else {
      setIsFirstUser(null)
    }
  }, [user.room])

  useEffect(() => {
    if (!isFirstUser && turn.user) {
      let userPlaying = turn.state === 'play' ? turn.user : user.socketId
      if (result.length) {
        userPlaying = result[0].user
      }
      console.log("Turn....", turn, result);
      console.log("setting is isFirstUser....", userPlaying);
      setIsFirstUser(userPlaying)
    }
    if (turn.state && !turn.user && user?.room?.type === 'cpu') {
      setTurn({ ...turn, user: user.socketId })
    }
  }, [turn])

  useEffect(() => {
    const gameRoom = document.getElementById('gameRoom');
    const scrollHeight = gameRoom.scrollHeight;
    gameRoom.scrollTop = scrollHeight
  }, [result])

  const subscibeEvents = () => {
    socket.on('activateYourTurn', (msg) => {
      setTurn(prevState => ({ ...prevState, ...msg }))
      console.log('ActivateYourTurn Event', msg);
      // if (!isFirst.user && msg.state === 'play' && msg.user === user.socketId)
      //   setIsFirst({ ...isFirst, user: msg.user})
    })
    socket.on('randomNumber', (msg) => {
      const data = { selectedNumber, ...msg }
      setNumber(parseInt(msg.number))
      console.log('RandomNumber Event', msg);
      if (msg.isFirst) setTurn({ state: 'play' })
      else setResult((prevState) => ([...prevState, data]))
    })
    socket.on('gameOver', (msg) => {
      // console.log("Gameover Event", msg);
      socket.emit('leaveRoom')
      setGameOver(msg)
      unsubscribeEvents()
    })
    socket.on('onReady', (msg) => {
      console.log("On ready event", msg);
      setIsReady(msg.state)
    })
  }

  const resetState = () => {
    setResult([])
    setSelectedNumber(null)
    setNumber(null)
    setTurn({})
    setGameOver({})
    setIsReady(false)
    setIsFirstUser(null)
  }

  const handleClick = (n) => {
    setSelectedNumber(n)
    socket.emit('sendNumber', { selectedNumber: n, number })
  }

  const handleNewGame = () => {
    resetState()
    subscibeEvents()
    const { name, type } = rooms.find(r => r.name === user?.room?.name)
    socket.emit('joinRoom', {
      username: user.user,
      room: name,
      roomType: type
    })
  }

  const renderMessageText = (msg) => {
    return <Typography className={classes.messageText}>{msg}</Typography>
  }
  const renderGameOver = () => {
    if (!gameOver.isOver) return null
    const hasWon = user.user === gameOver.user
    return (
      <Box className={classes.modal}>
        <Box className={classes.modalContent}>
          <Box className={classes.modalIcon}>
            {
              hasWon ? <WinIcon /> : <LoseIcon />
            }
          </Box>
          <Typography className={classes.gameOverText}>{hasWon ? 'You Win' : 'You Lose'}</Typography>
          <Button variant={'contained'} className={classes.newGame} onClick={handleNewGame}>New Game</Button>
        </Box>
      </Box>
    )
  }

  const renderGameSteps = () => {
    let stepClass = classes.playerInput
    if (isFirstUser === user.socketId) stepClass += ` ${classes.firstPlayer}`
    else stepClass += ` ${classes.secondPlayer}`
    return <Box className={classes.inputWrapper}>
      {
        result.map((player, idx) => {
          return <Box key={idx} className={stepClass}>
            {player.user === user.user ? <UserIcon /> : <PlayerIcon />}
            <Box className={classes.selectedNumber}>{player.selectedNumber}</Box>
          </Box>
        })
      }
    </Box>
  }

  const renderGameActions = () => {
    // console.log('render actions..............,',turn , user);
    return <Box className={classes.buttonWrapper}>
      {
        (isReady || result.length)
          ? (turn.user === user.socketId && turn.state === 'play') || (turn.user !== user.socketId && turn.state === 'wait')
            ? ACTIONS.map((n, idx) => {
              return (
                <Button key={idx} className={classes.playButton} onClick={() => handleClick(n)}>
                  {n}
                </Button>
              )
            })
            : renderMessageText('Please wait')
          : user.room
            ? renderMessageText('Wait for opponent to join')
            : renderMessageText('Select a room')
      }
    </Box>
  }
  return (
    <Box className={classes.root}>
      {renderGameOver()}
      <Box id={'gameRoom'} className={classes.playRoom}>
        {renderGameSteps()}
        {renderGameActions()}
      </Box>
    </Box>

  )
}

export default GameRoom