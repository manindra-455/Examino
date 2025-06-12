
import './App.css'
import AddRoomPage from './components/home/AddRoomPage';
import AllotmentSuccess from './components/home/AllotmentSuccess';
import Home from './pages/Home';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Add more routes here as needed */}
          <Route path="/" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/success" element={<AllotmentSuccess />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
