import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div>
        <p className="text-center text-2xl text-gray-500 pt-8">
          Contact <span className="text-gray-700 font-medium"> US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row justify-center gap-10 mb-28 text-sm">
        <img className="w-full md:max-w-[360px] " src={assets.contact_image} alt="" />
        <div className="flex flex-col justofy-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600 ">OUR OFFICE</p>
          <p className="text-gray-500">00000 Willms Station <br/> Suite 000, Washington, USA</p>
          <p className="text-gray-500">Tel: (000) 000-0000 <br/> Email: challavenkataramana321@gmail.com</p>
          <p className="font-semibold text-lg text-gray-600">CAREERS AT PRESCRIPTO</p>
          <p className="text-gray-500">Learn more about our teams and job openings.</p>
          <button className="border border-black px-8 py-4 text-sm rounded hover:bg-black hover:text-white transition-all duration-300">Explore Jobs</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
