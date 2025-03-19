import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  
  const {userData,setUserData,token,backendUrl,loadUserProfileData}=useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData=async()=>{
      try{
        const formData=new FormData();
        formData.append('name',userData.name);
        formData.append('phone',userData.phone);
        formData.append('gender',userData.gender);
        formData.append('dob',userData.dob);
        formData.append('address',JSON.stringify(userData.address));

        image && formData.append('image',image);

        const {data}=await axios.post(backendUrl+'/api/user/update-profile',formData,{headers:{token}});
        if(data.success){
          toast.success(data.message);
          await loadUserProfileData();
          setIsEdit(false);
          setImage(false);
        }else{
          toast.error(data.message);
        }
      }catch(e){
         console.log(e.message);
         toast.error(e.message);
      }
  }

  return userData && (
    <div className="p-3 sm:p-0">
      <div className="max-w-lg flex flex-col gap-2 text-sm">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 opacity-75 rounded"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              <img  className="w-10 absolute bottom-12 right-12 " src={image ? "" : assets.upload_icon} alt="" />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img className="w-36 rounded" src={userData.image} alt="" />
        )}

        {isEdit ? (
          <input
            className="bg-gray-200 text-medium focus:outline-none px-3 py-1 text-xl w-full mt-4 rounded-md"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="font-medium bg-gray-100 rounded-lg focus:outline-none text-2xl px-3 py-1 mt-4 text-neutral-800 w-full">
            {userData.name}
          </p>
        )}

        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <p className="text-neutral-500  mt-3 text-md font-semibold">
            Contact Information
          </p>
          <div className="grid grid-cols-[1fr_3fr] items-center gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-blue-500 ">{userData.email}</p>

            <p className="font-medium text-md ">Phone No:</p>
            {isEdit ? (
              <input
                className="bg-gray-200 px-1 py-1  focus:outline-none rounded-lg w-full"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-400 ">{userData.phone}</p>
            )}

            <p>Address:</p>
            {isEdit ? (
              <p>
                <input
                  className="bg-gray-200 px-1 focus:outline-none rounded-t-lg py-1 w-full"
                  type="text"
                  value={userData.address.line1}
                  placeholder="line 1..."
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <br />
                <input
                  className="bg-gray-200 px-1 py-1 focus:outline-none rounded-b-lg w-full"
                  type="text"
                  value={userData.address.line2}
                  placeholder="line 2..."
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </p>
            ) : (
              <p>
                <p>{userData.address.line1}</p>
                <p>{userData.address.line2}</p>
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-neutral-500 text-md font-semibold mt-3">
            Basic Information
          </p>
          <div className="grid grid-cols-[1fr_3fr] items-center gap-y-2.5 mt-3 text-neutral-700">
            <p>Gender :</p>

            {isEdit ? (
              <select
                className="w-full p-2"
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-400">{userData.gender}</p>
            )}

            <p className="font-medium">Birthday :</p>
            {isEdit ? (
              <input
                className="bg-gray-200 py-2 px-2  focus:outline-none w-full rounded-md"
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-400">{userData.dob}</p>
            )}
          </div>
        </div>
        <div className="mt-10">
          {isEdit ? (
            <button
              className="border border-gray-600 px-8 py-2 rounded-full font-medium hover:text-white  hover:bg-gray-500 transition-all duration-300"
              onClick={updateUserProfileData}
            >
              Save Information
            </button>
          ) : (
            <button
              className="border border-gray-600 px-8 py-2 rounded-full font-medium  hover:text-white hover:bg-gray-500 transition-all duration-300"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
