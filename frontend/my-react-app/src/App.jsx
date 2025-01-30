import { useState } from 'react'
import './App.css'
import Register from './component/register'
import Login from './component/login'
import Navigate from './component/navigate'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Api from './component/api'


function App() {

  return (
      <BrowserRouter>
      <Navigate></Navigate>
      <Routes>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/api' element={<Api/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
