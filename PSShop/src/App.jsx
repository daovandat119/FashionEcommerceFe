import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePages from './pages/homepages/HomePages';
//import HomePages1 from './pages/homepages/HomePage1';
import LoginPage from './pages/login/LoginPage';
import "./styles/style.scss";
import Context from './context/Context';
// import "rc-slider/assets/index.css";
// import "tippy.js/dist/tippy.css";
import AboutPage from './pages/about';
import ShopPages1 from './pages/shoplist/shoplist-1';
function App() {

  return (
    <Context>
    <Router>
    <Routes>
      <Route  path="/" element={<HomePages/>}/>
      <Route path="shop-1" element={<ShopPages1 />} />
      <Route path="login_register" element={<LoginPage />} />
      <Route path="about" element={<AboutPage />} />
    </Routes>
  </Router>
  </Context>
  )
}

export default App
