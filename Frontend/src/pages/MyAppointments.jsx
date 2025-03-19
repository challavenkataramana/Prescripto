import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyAppointments = () => {
  const { backendUrl,token,getDoctorsData } = useContext(AppContext);

  const [appointments,setAppointments]=useState([]);
  const months=[" ","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
   
  const slotDateFormat=(slotDate)=>{
    const dateArray=slotDate.split("_");
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2];
  }

  const getUserAppointments=async()=>{
     try{
        const {data}=await axios.get(backendUrl+'/api/user/appointments',{headers:{token}});
  
        if(data.success){
           setAppointments(data.appointments.reverse());
        }

     }catch(e){
        console.log(e);
        toast.error(e.message);
     }
  }

  const cancelAppointment=async(appointmentId)=>{
      try{
        const {data}=await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{token}});
        console.log(data);
        if(data.success){
          toast.success(data.message);
          getUserAppointments();
          getDoctorsData();
       }
       else{
         toast.error(data.message);
       }

      }catch(e){
        console.log(e);
        toast.error(e.message);
     }
  }

  useEffect(()=>{
     if(token){
        getUserAppointments();
     }
  },[token])

  return (
    <div>
      <p className="pb-3 mt-8 font-semibold text-gray-700 border-b border-gray-200">
        My appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-gray-200"
            key={index}
          >
            <div>
              <img className="w-32 bg-indigo-50" src={item.docData.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-800">
              <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className="text-gray-600 font-semibold mt-1">Address:</p>
              <p className="text-md">{item.docData.address.line1}</p>
              <p className="text-md">{item.docData.address.line2}</p>
              <p className="text-md mt-1">
                <span className="text-sm text-gray-600 font-semibold">Date & Time: </span>{slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end -40">
                 {!item.cancelled && !item.isCompleted && <button className="text-sm text-gray-500 font-semibold text-center sm:min-w-48 py-1.5 border rounded hover:bg-green-500 hover:text-white hover:font-semibold transition-all duration-300">Pay Online</button> }
                 {!item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className="text-sm text-gray-500 font-semibold text-center sm:min-w-48 py-1.5 border rounded  hover:bg-red-700 hover:text-white hover:font-semibold transition-all duration-300">Cancel Appointment</button>}
                 {item.cancelled && !item.isCompleted && <button className="sm:min-w-48 py-2 border brder-red-500 rounded text-red-500">Appointment Cancelled</button>}
                 {item.isCompleted && <button className="sm:min-w-48 py-2 border brder-red-500 rounded text-green-500"> Completed </button>}
            </div>
        

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
