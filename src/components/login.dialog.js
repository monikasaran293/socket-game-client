import { useContext, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { SocketContext } from '../pages/home';

const LoginDialog = () => {
  const { socket } = useContext(SocketContext)

  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState('')

  const handleClose = () => {
    if (username.trim()) {
      setOpen(false);
      socket.emit('login', { username })
    }
  };

  return (
    <div>
      <Dialog open={open} fullWidth={true} maxWidth={'xs'}>
        <DialogTitle>Enter Username</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LoginDialog