// eslint-disable-next-line no-unused-vars
import React from "react";
import Headers from "../../components/headers/Headers";
import Footers from "../../components/footers/Footers";
import LoginRegister from "../../components/login/LoginRegister";


const LoginPage = () => {
  return (
    <>
          <Headers />
      <main className="page-wrapper mb-4 pb-4">
        <div className=" mb-4 pb-4"></div>
        <LoginRegister />
      </main>
      <div className="mb-5 pb-xl-5"></div>
      <Footers />
    </>
  );
};

export default LoginPage ;
