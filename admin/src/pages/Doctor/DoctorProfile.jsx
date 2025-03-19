import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { profileData, getProfileData, setProfileData, dToken,backendUrl } =
    useContext(DoctorContext);
  const { currency} = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile=async()=>{
     try{
       const updateData={
         address:profileData.address,
         fees:profileData.fees,
         available:profileData.available
       }
       
       const {data}=await axios.post(backendUrl+'/api/doctor/update-profile',updateData,{headers:{dToken}});
       if(data.success){
          setIsEdit(false);
          getProfileData();
          toast.success(data.message);
       }
       else{
          toast.error(data.message)
       }
     }catch(e){
        console.log(e);
        toast.error(e.message);
     }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);
  return (
    profileData && (
      <div >
        <div className="flex flex-col gap-4 m-5 overflow-y-scroll">
          <div>
            <img
              className="w-full sm:max-w-64 bg-gray-500 rounded-lg"
              src={profileData.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-200 p-8 py-7 rounded-lg bg-white ">
            <p className="flex items-center gap-2 text-3xl text-gray-700 font-medium">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 test-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border border-gray-300 rounded-full">
                {profileData.experience}
              </button>
            </div>

            {/*......Doctor ABout.......*/}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:{" "}
              </p>
              <p className="text-m text-gray-600 max-w-[700px] t-1">
                {profileData.about}
              </p>
            </div>
            <p className="text-gray-700 font-medium mt-4 ">
              Appointment Fees: 
              <span className="text-gray-900 ml-1">
                {" "}
                {currency}{" "}
                {isEdit ? (
                  <input
                     className="bg-gray-200 text-medium focus:outline-none px-2 py-1 rounded-md"
                    type="number"
                    value={profileData.fees}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>
            <div className="flex  py-2  flex-col sm:flex-row gap-2 ">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    className="bg-gray-200 px-1 mb-1 focus:outline-none  rounded-t-lg py-1 w-full"
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev)=>({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    type="text"
                    className="bg-gray-200 px-1 py-1 focus:outline-none rounded-b-lg w-full"
                    onChange={(e) =>
                      setProfileData((prev)=>({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>
            <div className="flex gap-2 py-2 ">
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                type="checkbox"
                name=""
                id=""
              />
              <label htmlFor="">Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-5 py-1 border border-gray-400 text-m rounded-full mt-5 hover:bg-gray-400 hover:text-black transition-all duration-300"
              >
                Save Info
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-8 py-1 border border-gray-400 text-m rounded-full mt-5 hover:bg-gray-400 hover:text-black transition-all duration-300"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
