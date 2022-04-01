
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

const initialState = {
  error: null,
  rooms: [],
  users: [],
  user: {}
};

const playReducer = (state = initialState, action) => {
  // console.log("Reducer....", state);
  switch (action?.type) {
    case "USERS":
      return {
        ...state,
        users: action.payload
      };
    case "ROOMS":
      return {
        ...state,
        rooms: action.payload
      };
    case "LOGIN":
      return {
        ...state,
        user: action.payload
      }
    case "JOIN_ROOM":
      const room = state.rooms.find(r => r.name === action.payload)
      return {
        ...state,
        user: {
          ...state.user,
          room
        }
      }
    default:
      return state;
  }
};

const createRootReducer = (history) => combineReducers({
  playReducer,
  router: connectRouter(history),
});

export default createRootReducer;