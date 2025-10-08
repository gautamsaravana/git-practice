import axios from "axios";

const API_URL = "http://localhost:2025/expresscinema/saveMovie";

const addMovie = (movie) => {
  return axios.post(API_URL, movie);
};

const MovieService = { addMovie };
export default MovieService;