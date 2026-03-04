import { Routes, Route} from "react-router-dom";
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import UserHome from './components/UserHome';
import Search from './components/Search';
import Profile from './components/Profile';
import './css/App.css';

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/home' element={<UserHome />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/search' element={<Search />} />
      </Routes>
    </>
  )
}

export default App
