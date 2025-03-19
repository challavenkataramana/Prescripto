import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

function Banner() {
  const navigate = useNavigate();
  return (
   
      <div className="flex  bg-gray-600 px-6 rounded-lg sm:px-10 lg:px-12 my-10 md:mx-10">
        <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24lg:pl-5">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
            <p className="">Book Appointment</p>
            <p className="mt-3">With 100+ trusted Doctors</p>
          </div>
          <button
            onClick={() => {
              navigate("/login");
              scrollTo(0, 0);
            }}
            className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all"
          >
            Create Account
          </button>
        </div>
        <div className="hidden md:block lg:w-[350px] relative md:w-1/2 ">
          <img
            className="w-full absolute bottom-0 right-0 max-w-md"
            src={assets.appointment_img}
            alt=""
          />
        </div>
      </div>
    
  );
}

export default Banner;
