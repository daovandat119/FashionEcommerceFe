import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePages from './pages/homepage/HomePages';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route  path="/" element={<HomePages/>}/>
   
      </Routes>
    </Router>
  );
};

export default App;
