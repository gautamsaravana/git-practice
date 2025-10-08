
import axios from "axios";

const API_BASE_URL = "http://localhost:2025/expresscinema/createUser";
const LOGIN_API='http://localhost:2025/expresscinema/checkuser';

const CheckEmailAPI="http://localhost:2025/expresscinema/check-email/";


const registerUser=(userData)=>{
    return axios.post(API_BASE_URL, userData);
}

const login = (checkDetails)=>{
    return axios.post(LOGIN_API,checkDetails);

}

const checkEmail = (email) => {
  return axios.get(CheckEmailAPI + email);
};




const UserService = {
  registerUser,login,checkEmail
};

export default UserService;
