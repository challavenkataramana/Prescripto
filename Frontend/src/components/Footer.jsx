import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
   
      <div className="md:mx-10">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
          <div>
            <img className="w-40 mb-5" src={assets.logo} alt="Logo" />
            <p className="w-full md:w-2/3 text-gray-600 leading-6">
              This website is purely for testing and development purposes. It
              serves as a platform to experiment with new features, optimize
              performance, and enhance user experience.
            </p>
          </div>
          <div className="">
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li>Home</li>
              <li>About us</li>
              <li>Contact</li>
              <li>Privacy policy</li>
            </ul>
          </div>
          <div className="">
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li>+917995822391</li>
              <li>challavenkataramana321@gmail.com</li>
            </ul>
          </div>
        </div>
        <div>
          <hr />
          <p className="text-center text-sm py-5">
            Copyright 2025@Prescripto - All Rights Reserved
          </p>
        </div>
      </div>
    
  );
};

export default Footer;
