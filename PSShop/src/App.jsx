import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePages from './pages/homepages/HomePages';
import HomePages1 from './pages/homepages/HomePage1';



function App() {

  return (
    <Router>
    <Routes>
      <Route  path="/" element={<HomePages/>}/>
      <Route path="/home-1" element={<HomePages1 />} />
      
    
    </Routes>
  </Router>
  )
}

export default App
