import React from "react";
import { useNavigate } from "react-router-dom";

const SignUpBtn = () => {
  const navigate = useNavigate()
  return (
    <>
      <div
       className="w-24 m-3 p-3  text-center rounded-2xl text-white cursor-pointer bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 shadow-md hover:shadow-lg"
       onClick={()=> navigate("/signup")}
       >
        <button className="font-medium text-[17px] cursor-pointer">
          SignUp
        </button>
      </div>
    </>
  );
};

export default SignUpBtn;
