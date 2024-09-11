import axios from "axios";
const httpCommon = axios.create({
  baseURL:
   import.meta.env.VITE_REACT_SERVER_URL
    ? import.meta.env.VITE_REACT_SERVER_URL
    : 
    // "https://api.fronterascheduling.com",
    "http://13.61.2.154:3000",
    // "http://localhost:3000",

});

export default httpCommon;
export const httpAuth = axios.create({
  // baseURL: "https://api.fronterascheduling.com",
  baseURL: "http://13.61.2.154:3000",
  // baseURL: "http://localhost:3000",


});
