import { createSlice } from '@reduxjs/toolkit'

const initialState =  { testCotent : 'testingRedux' }


const TestSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {}
  })


export default TestSlice.reducer
