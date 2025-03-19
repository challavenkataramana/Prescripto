import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();

  const { doctors, currencySymbol, getDoctorsData, backendUrl, token } =
    useContext(AppContext);

  const navigate = useNavigate();

  const [docInfo, setDocinfo] = useState();
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const fetchInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocinfo(docInfo);
  };

  const getavailableslots = async () => {
    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      //getting date width index
      let currdate = new Date(today);
      currdate.setDate(today.getDate() + i);

      let endtime = new Date();
      endtime.setDate(today.getDate() + i);
      endtime.setHours(21, 0, 0, 0);

      if (today.getDate() === currdate.getDate()) {
        currdate.setHours(
          currdate.getHours() > 10 ? currdate.getHours() + 1 : 10
        );
       
        currdate.setMinutes(currdate.getMinutes() > 30 ? 30 : 0);
      } else {
        currdate.setHours(10);
        currdate.setMinutes(0);
      }
      let timeSlots = [];
      while (currdate < endtime) {
        let formattedtime = currdate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day =currdate.getDate();
        let month =currdate.getMonth() + 1;
        let year = currdate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;

        const slotTime=formattedtime;
        
        const isSlotAvailable=docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true ;

        if(isSlotAvailable){
          timeSlots.push({
            datetime: new Date(currdate),
            time: formattedtime,
          });
        }

        //add slots to array
        

        currdate.setMinutes(currdate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    try {
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getavailableslots();
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-gray-200 w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex item-center text-2xl gap-2 font-medium text=gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 rounded-lg text-xs px-2">
                {docInfo.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 font-medium text-gray-900 text-sm mt-3 ">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[720px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 mt-4 font-medium">
              Appointment fee :
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}{" "}
              </span>
            </p>
          </div>
        </div>

        {/*.......Booking slots ...... */}
        <div className="sm:ml-78 sm:py-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4 ">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-gray-500 text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 rounded-full py-2 cursor-pointer1 ${
                    item.time === slotTime
                      ? "bg-gray-500 text-white"
                      : "text-gray-400 border  border-gray-200"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <div>
            <button
              onClick={bookAppointment}
              className="bg-gray-500 text-white text-sm font-light px-14 py-3 rounded-full my-6"
            >
              Book an appointment
            </button>
          </div>
        </div>

        {/*....Relating Doctors..... */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
