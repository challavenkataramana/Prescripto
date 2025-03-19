import React, { useState,useContext,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import  {AppContext}  from "../context/AppContext";
import "../components/TopDoctors.css"
const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter,setShowFilter]=useState(false);

  const navigate=useNavigate();
  const applyFilter=()=>{
     if(speciality){
       setFilterDoc(doctors.filter((doc)=> doc.speciality===speciality));
     }
     else{
       setFilterDoc(doctors);
     }
  }

  useEffect(()=>{
      applyFilter();
  },[doctors,speciality])

  return (
    <div className="p-2 md:p-0">
    <div>
      <p className="text-gray-600">Browse through the doctors specialist</p>
      <div className="flex flex-col sm:flex-row  items-start gap-5 mt-5 ">
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-gray-600 text-white transition-all duration-200 " :""}` } onClick={()=>setShowFilter(prev=>!prev)}>Filter</button>
        <div className={`flex flex-col gap-3  text-sm text-gray-600 ${showFilter?"flex":"hidden sm:flex"}`}>
          <p onClick={()=> speciality==='General physician'? navigate('/doctors'): navigate('/doctors/General physician')} className={`w-[89vw]  sm:w-auto pl-3 py-2  pr-14 bg-gray-200  rounded transition-all cursor-pointer  ${speciality==="General physician" ? "bg-indigo-200  text-black":""}`} >General Physician</p>
          <p onClick={()=> speciality==='Gynecologist'? navigate('/doctors'): navigate('/doctors/Gynecologist')} className={`w-[89vw]    sm:w-auto pl-3 py-2  pr-14 bg-gray-200 rounded transition-all cursor-pointer   ${speciality==="Gynecologist" ? "bg-indigo-200 text-black" : ""}`} >Gynecologist</p>
          <p onClick={()=> speciality==='Dermatologist'? navigate('/doctors'): navigate('/doctors/Dermatologist')} className={`w-[89vw]   sm:w-auto pl-3   py-2 pr-14 bg-gray-200 rounded transition-all cursor-pointer  ${speciality==="Dermatologist" ? "bg-indigo-200 text-black" : ""}`} >Dermatologist </p>
          <p onClick={()=> speciality==='Pediatricians'? navigate('/doctors'): navigate('/doctors/Pediatricians')}  className={`w-[89vw]    sm:w-auto pl-3   py-2 pr-14 bg-gray-200 rounded transition-all cursor-pointer  ${speciality==="Pediatricians"? "bg-indigo-200 text-black" : ""}`} >Pediatricians</p>
          <p onClick={()=> speciality==='Neurologist'? navigate('/doctors'): navigate('/doctors/Neurologist')} className={`w-[89vw]    sm:w-auto pl-3 py-2   pr-14 bg-gray-200 rounded transition-all cursor-pointer  ${speciality==="Neurologist" ? "bg-indigo-200 text-black" : ""}`} >Neurologist</p>
          <p onClick={()=> speciality==='Gastroenterologist'? navigate('/doctors'): navigate('/doctors/Gastroenterologist')} className={`w-[89vw]    sm:w-auto   pl-3 py-2 pr-14 bg-gray-200 rounded transition-all cursor-pointer  ${speciality==="Gastroenterologist" ? "bg-indigo-200 text-black" :""}`} >Gastroenterologist</p>
        </div>
        <div id="gridcount" className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              key={index}
              className="border border-blue-200 rounded-xl cursor-pointer overflow-hidden hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-blue-50 " src={item.image} alt="" />
              <div className="p-4">
              <div className={`flex  items-center gap-2 text-sm ${item.available?'text-green-500':'text-gray-500'}`}>
                <p className={`w-2 h-2 ${item.available ? 'bg-green-500':'bg-gray-500'}  rounded-full`}></p>
                <p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
                <p className="text-gray-900 text-sm font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm ">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Doctors;
