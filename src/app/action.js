import UserService from "./service";

export const loginUser = (user) => (dispatch) => {
  dispatch({
    type: 'LOGIN',
    payload: user,
  });
};

export const joinRoom = (room) => (dispatch) => {
  dispatch({
    type: 'JOIN_ROOM',
    payload: room,
  });
};

export const getRooms = () => async (dispatch) => {
  try {
    const res = await UserService.getRooms();
    dispatch({
      type: 'ROOMS',
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getUsers = () => async (dispatch) => {
  try {
    const res = await UserService.getUsers();
    dispatch({
      type: 'USERS',
      payload: res.data,
    });
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};
