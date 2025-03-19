import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";

function Login() {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          toast.success("Login Successfull");
          setAToken(data.token);
          
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          toast.success("Login successfull");
          setDToken(data.token);
         
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96  rounded-xl text-gray-900 shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-gray-600">{state} </span>
          Login
        </p>
        <div className="w-full">
          <p className="text-gray-500">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className=" bg-gray-200 rounded-lg w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p className="text-gray-500">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className=" bg-gray-200 rounded-lg w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button className="bg-gray-600 rounded-lg mt-4 text-white w-full py-2 text-base">
          Login
        </button>
        <div>
          {state == "Admin" ? (
            <p className="text-gray-900">
              Doctor Login ?
              <span
                className="text-gray-500 ml-2 underline cursor-pointer"
                onClick={() => setState("Doctor")}
              >
                {" "}
                Click here
              </span>
            </p>
          ) : (
            <p className="text-gray-900">
              Admin Login ?
              <span
                className="text-gray-500 ml-2 underline cursor-pointer"
                onClick={() => setState("Admin")}
              >
                {" "}
                Click here
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

export default Login;
