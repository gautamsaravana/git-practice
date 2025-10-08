import axios from "axios"

const Api=axios.create({
    baseURL:"http://localhost:2025/expresscinema",
    headers: {
        "Content-Type": "application/json"
    }
})
export default Api