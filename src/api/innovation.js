import { apiRoutes } from "../apiRoutes";
import axios from "axios";

export const newInnovation = async (values) => {
  return await axios.post(apiRoutes.innovation, values);
};
