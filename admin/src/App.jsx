import { useContext, useState } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import DoctorList from "./pages/Admin/DoctorsList";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashBoard from "./pages/Doctor/DoctorDashBoard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";

function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className="bg-gray-100">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/*...Admin Routes...*/}
            
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorList />} />

          {/*...Doctor Routes */}

          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/doctor-dashboard" element={<DoctorDashBoard />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}
export default App;
