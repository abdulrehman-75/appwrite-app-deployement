import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: false,
  userData: null  // Changed from setData to userData for consistency
}

export const authSlice = createSlice({  // Changed from todoSlice to authSlice
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
       state.status = true;  // Fixed: was state.state = true
       state.userData = action.payload;  // Changed from setData to userData
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;  // Changed from setData to userData
    },
  },
})

export const { login, logout } = authSlice.actions  // Changed from todoSlice to authSlice

export default authSlice.reducer