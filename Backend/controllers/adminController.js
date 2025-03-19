import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

//API for adding doctor from admin panel
const addDoctor = async (req, res) => {
  try {
   
    const {
      name,
      email,
      password,
      speciality,
      fees,
      experience,
      degree,
      about,
      address,
    } = req.body;
    const imageFile = req.file;

    //checking for all data to add doctor..
    if (
      !name ||
      !degree ||
      !speciality ||
      !experience ||
      !fees ||
      !email ||
      !password ||
      !about ||
      !address
    ) {
      return res.json({ success: false, message: "Missing  Details" });
    }

    //validating email formatimg
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }

    //validating strong password

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    //hasing doctor password...
    const salt = await bcrypt.genSalt(10);
    const hassedPassword = await bcrypt.hash(password, salt);

    //upload image to cloudinary..
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hassedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    return res.json({ success: true, message: "Doctor addedd" });
  } catch (e) {
    console.log(e);
    return res.json({ success: false, message: e.message });
  }
};

//api to login for admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (e) {
    console.log(e);
    return res.json({ success: false, message: e.message });
  }
};

//api to get all doctors for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");

    return res.json({ success: true, doctors });
  } catch (e) {
    console.log(e);
    return res.json({ success: false, message: e.message });
  }
};

//api to get all appointment list for doctor panel..
const appointmentsAdmin=async(req,res)=>{
    try{

      const appointments=await appointmentModel.find({});
      return res.json({ success: true, appointments });

    }catch(e){
      console.log(e);
      return res.json({ success: false, message: e.message });
    }
}

//api for appointment cancellation

//api to cancel appointment...
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //release doctor slots
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.json({ success: true, message: "Appointment cancelled" });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

//api to get dashboard data fro admin panel

const adminDashBoard=async(req,res)=>{
    try{
      const doctors=await doctorModel.find({});
      const users=await userModel.find({});
      const appointments=await appointmentModel.find({});

      const dashData={
         doctors:doctors.length,
         appointments:appointments.length,
         patients:users.length,
         latestAppointments:appointments.reverse().slice(0,5)
      }

      return res.json({success:true,dashData})




    } catch (e) {
      console.log(e.message);
      return res.json({ success: false, message: e.message });
    }
}


export { addDoctor, loginAdmin, allDoctors,appointmentsAdmin,appointmentCancel,adminDashBoard };
