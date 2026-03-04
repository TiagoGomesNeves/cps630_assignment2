import { useState } from 'react';
import { Routes, Route} from "react-router-dom";
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import UserHome from './components/UserHome'
import './css/App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/home' element={<UserHome />} />
      </Routes>
    </>
  )
}

export default App
