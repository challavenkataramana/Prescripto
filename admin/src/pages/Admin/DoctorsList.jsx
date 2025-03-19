import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors,changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="m-5 overflow-y-scroll max-h-[80vh]">
      <h1 className="text-lg font-semibold ">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-4 gap-y-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="border border-indigo-200 rounded-xl max-w-56 cursor-pointer overflow-hidden "
          >
            <img className="bg-blue-50 hover:bg-gray-600 transition-all duration-500 " src={item.image} alt="" />
            <div className="p-4">
              <p className="text-gray-900 text-md font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm ">{item.speciality}</p>
              <div className="flex  items-center gap-2 text-sm text-green-500">
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
