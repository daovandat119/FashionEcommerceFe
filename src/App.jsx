
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePages from './pages/homepages/HomePages';
import LoginPage from './pages/login/LoginPage';

function App() {


  return (
    <Router>
    <Routes>
      <Route  path="/" element={<HomePages/>}/>
      <Route path="login_register" element={<LoginPage />} />
    </Routes>
  </Router>
  )
}

export default App
