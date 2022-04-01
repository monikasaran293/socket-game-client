import { useSelector } from "react-redux";

import { Box, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";

import { ReactComponent as ArrowIcon } from "../assets/arrow.svg";

const useStyles = makeStyles({
  sideNav: {
    padding: 16
  },
  roomList: {
    margin: '16px 0',
    backgroundColor: 'white',
    border: 5
  },
  roomName: {
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '18px',
    flex: 1
  },
  roomItem: {
    display: 'flex',
    cursor: 'pointer',
    padding: '30px 20px',
    borderBottom: '1px solid #F8F5F2'
  },
  selectedRoomItem: {
    background: '#1574F5',
    color: 'white !important'
  },
  arrow: {
    color: '#1574F5'
  }
});

const SideNav = ({ selectedRoom, setSelectedRoom }) => {
  const classes = useStyles();
  const { rooms } = useSelector((state) => state.playReducer);

  return (
    <Box className={classes.sideNav}>
      <Typography className={classes.roomName}>Choose your game room</Typography>
      <Box className={classes.roomList}>
        {
          rooms.map((room, idx) => {
            let itemClassname = classes.roomItem
            let arrowClassname = classes.arrow
            if (room.name === selectedRoom.name) {
              itemClassname += ` ${classes.selectedRoomItem}`
              arrowClassname += ` ${classes.selectedRoomItem}`
            }
            return <Box key={idx} className={itemClassname} onClick={() => setSelectedRoom(room)}>
              <Typography className={classes.roomName}>{room.name}</Typography>
              <ArrowIcon className={arrowClassname} />
            </Box>
          })
        }
      </Box>
    </Box>
  )
}

export default SideNav