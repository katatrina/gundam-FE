import axios from 'axios'

// Configure the default Axios settings globally
axios.defaults.baseURL = 'http://localhost:8080/v1'
axios.defaults.timeout = 10000 // 10 seconds
axios.defaults.headers['Content-Type'] = 'application/json'

// You can set other default configurations here if needed
// axios.defaults.headers['Authorization'] = 'Bearer YOUR_TOKEN';

export default axios
