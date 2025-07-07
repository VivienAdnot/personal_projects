import restrictions from "./index.restrictions";
import handlers from "./index.handlers";
import responseSender from "../../services/responseSender";

const routes = [
  {
    method: "GET",
    path: "/users",
    handlers: [handlers.getUsers, responseSender.responseSender]
  },
  {
    method: "POST",
    path: "/users",
    handlers: [
      restrictions.postUser,
      handlers.postUser,
      responseSender.responseSender
    ]
  },
  {
    method: "POST",
    path: "/auth/login",
    handlers: [handlers.authenticateUser, responseSender.responseSender]
  }
];

module.exports = routes;
