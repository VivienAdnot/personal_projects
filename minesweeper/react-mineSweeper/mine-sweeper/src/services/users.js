import axios from "axios";
import { config } from "../config";

export const requestCreateUser = user => {
  return axios.post(`${config.api}/users`, user);
};

export const requestAuthenticateUser = user => {
  return axios.post(`${config.api}/auth/login`, user);
};
