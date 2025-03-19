import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorAppointments = () => {
  const {
    dToken,
    getAppointments,
    appointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { currency, slotDateFormat, calculateAge } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);
  return (
    <div className="m-2 sm:m-5">
      <p className="mb-3 text-xl font-semibold text-gray-600">
        All Appointments
      </p>
      <div className="bg-white border border-gray-200 rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden text-lg font-semibold grid grid-cols-[0.5fr_3fr_1.5fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-200">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appointments.reverse().map((item, index) => (
          <div
            className="flex flex-wrap text-md justify-between max-sm:gap-5 sm:grid sm:grid-cols-[0.5fr_3fr_1.5fr_1fr_3fr_1fr_1fr] items-center py-3 px-6 text-gray-900  border-b border-gray-200 hover:text-gray-500"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt=""
              />
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className="text-xs inline border  px-2 border-gray-300 rounded-full">
                {item.payment ? "Online" : "Cash"}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)},{item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-md text-red-500">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-md text-green-500">Completed</p>
            ) : (
              <div className="flex items-center ">
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
                <img
                  onClick={() => completeAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
