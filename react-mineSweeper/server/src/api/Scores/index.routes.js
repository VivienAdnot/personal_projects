import handlers from "./index.handlers";
import responseSender from "../../services/responseSender";

const routes = [
  {
    method: "POST",
    path: "/scores",
    handlers: [handlers.postScore, responseSender.responseSender]
  },
  {
    method: "GET",
    path: "/best-scores",
    handlers: [handlers.getBestScores, responseSender.responseSender]
  }
];

module.exports = routes;
