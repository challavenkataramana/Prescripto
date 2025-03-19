import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);


  const [showDropdown, setShowDropdown] = useState(false);

 
  const toggleDropdown = (e) => {
    e.stopPropagation(); 
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  const {token,setToken,userData}=useContext(AppContext);
  const logout=()=>{
     setToken(false);
     localStorage.removeItem('token');
  }

  return (
    <div  className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img className="w-44 cursor-pointer" src={assets.logo} alt="Logo" />

      <ul className="hidden md:flex items-start gap-5 font-semibold">
        <NavLink to="/" className="relative">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-blue-500 w-4/4 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-blue-500 w-4/4 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-blue-500 w-4/4 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-blue-500 w-4/4 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {token && userData ? (
          <div onClick={toggleDropdown} className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 h-8 rounded-full"
              src={userData.image}
              alt="Profile"
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
            <div    className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 ${
          showDropdown ? "block" : "hidden"
        } group-hover:block`}>
              <div className="flex flex-col min-w-48 rounded bg-stone-100 gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-500 text-white px-8 py-2 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu"
        />

        <div
          className={`fixed inset-0  md:hidden  z-50 ${
            showMenu ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-opacity duration-300 bg-black bg-opacity-30`}
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowMenu(false)}
        >
          <div
            className={`fixed top-0 left-0 h-full w-3/4 bg-white shadow-lg transform ${
              showMenu ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMenu(false)}
              className="absolute top-4  right-4 text-gray-700 text-4xl hover:text-red-600"
            >
              &times;
            </button>

            <ul className="flex flex-col gap-4 mt-10 font-semibold p-6">
              <NavLink
                to="/"
                onClick={() => setShowMenu(false)}
              >
               <p  className="py-4 px-2 text-left bg-gray-100 rounded-md cursor-pointer hover:bg-gray-100"> HOME</p>
              </NavLink>
              <NavLink
                to="/doctors"
                onClick={() => setShowMenu(false)}
              >
               <p  className="py-4 px-2 text-left bg-gray-100 rounded-md cursor-pointer hover:bg-gray-300">ALL DOCTORS</p>
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setShowMenu(false)}
              >
               <p  className="py-4 px-2 text-left bg-gray-100 rounded-md cursor-pointer hover:bg-gray-300">ABOUT</p>
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setShowMenu(false)}
              >
               <p  className="py-4 px-2 text-left bg-gray-100 rounded-md cursor-pointer hover:bg-gray-300">CONTACT</p>
              </NavLink>
              {!token && (
                <NavLink
                  to="/login"
                  onClick={() => setShowMenu(false)}
                >
                 <p  className="py-4 px-2 text-left bg-gray-100 rounded-md cursor-pointer hover:bg-gray-300  ">LOGIN</p>
                </NavLink>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
