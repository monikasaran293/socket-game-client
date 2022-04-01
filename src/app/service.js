import http from "../http-common";

class GameService {
  getRooms() {
    return http.get("/rooms");
  }
  getUserss() {
    return http.get("/users");
  }
}

export default new GameService();