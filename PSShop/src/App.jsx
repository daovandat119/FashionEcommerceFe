import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePages from './pages/homepages/HomePages';
import HomePages1 from './pages/homepages/HomePage1';
import LoginPage from './pages/login/LoginPage';



function App() {

  return (
    <Router>
    <Routes>
      <Route  path="/" element={<HomePages/>}/>
      <Route path="shop-1" element={<HomePages1 />} />
      <Route path="login_register" element={<LoginPage />} />
    
    </Routes>
  </Router>
  )
}

export default App
