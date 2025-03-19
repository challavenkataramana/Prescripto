import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const { token, setToken, backendUrl } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          toast.success("User Registration Successfull");
          localStorage.setItem("token", token);
          setToken(data.token);
        } else {
          toast.error(data.message);
          console.log(data);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          toast.success("Login Successfull");
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
          console.log(data);
        }
      }
    } catch (e) {
      toast.error(e.message);
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);
  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col items-start gap-3 m-auto p-8 min-w-[340px] sm:min-w-96 borde rounded-xl text-sm shadow-lg">
        <p className="text-center text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p className="font-semibold text-gray-500">
          Please {state === "Sign Up" ? "sign up" : "log in"} to book
          appointment
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p className="text-md font-semibold text-gray-600">Full Name</p>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className="border border-zinc-300 rounded w-full p-2 mt-1"
            />
          </div>
        )}

        <div className="w-full">
          <p className="text-md font-semibold text-gray-600">Email</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1"
          />
        </div>
        <div className="w-full">
          <p className="text-md font-semibold text-gray-600">Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            className="border border-zinc-300 rounded w-full p-2 mt-1"
          />
        </div>
        <button
          type="submit"
          className="bg-gray-600 text-white w-full py-2 rounded-md border-base"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-gray-600 underline font-semibold cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-gray-600 underline font-semibold cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
