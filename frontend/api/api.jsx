import axios from 'axios'
import React from 'react'

const api = axios.create({
  baseURL:"http://localhost:5000/api",
  withCredentials: true,
})

export default api;