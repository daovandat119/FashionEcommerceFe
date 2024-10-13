import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  return (
    <div className="bg-gradient-to-t from-slate-300 via-slate-200 to-slate-100 w-full h-[100vh] flex items-center">
      <div className="w-[30%] mx-auto bg-white py-3 rounded-lg shadow-2xl">
        <img className=" w-[1//4] mx-auto pt-5" src="http://localhost:5175/assets/images/logo.png"></img>
        <div className="text-2xl font-semibold text-center py-3">LOGIN ADMIN</div>
        <form className="flex flex-col justify-start items-start gap-4 p-3">
          <div className="relative flex items-center w-full border-b-2 ">
            <FontAwesomeIcon icon={faUser} className="absolute left-3 text-gray-400" />
            <input 
              className="outline-none w-full py-2 pl-10 text-lg" 
              placeholder="Email" 
              type="email" 
              id="email"  
              required 
            />
          </div>
          <div className="relative flex items-center w-full border-b-2">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 text-gray-400" />
            <input 
              className="outline-none w-full py-2 pl-10 text-lg" 
              placeholder="Password" 
              type="password" 
              id="password" 
              required 
            />
          </div>
          
            <div className="flex items-center gap-2 pl-3">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
           
         
          <button 
            type="submit" 
            className="bg-slate-600 mt-3 hover:from-slate-300 w-2/5 py-3 mx-auto text-center rounded-full
            active:opacity-40 transition-all duration-300 text-white font-semibold"
          >
            LOGIN
          </button>
          <a href="/" className="text-black opacity-50 hover:opacity-90 text-center w-full font-medium mt-14">Forgot Password?</a>
        </form>
      </div>
    </div>
  );
};

export default Login;