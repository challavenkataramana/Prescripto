import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from 'razorpay';

//api to register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing fields" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter strong password" });
    }

    //hasing user password
    const salt = await bcrypt.genSalt(10);
    const hassedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hassedPassword,
    };

    const newUser = new userModel(userData);

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({ success: true, token });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

//api to get user profile..

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    return res.json({ success: true, userData });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

//api to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, dob, gender, address } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender || !address) {
      return res.json({ message: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    //upload image to cloudinary..
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    return res.json({ success: true, message: "Profile Updated" });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

//api to book appointment
const bookappointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not Available" });
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.json({ success: true, message: "Appointment Booked" });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

//api to get appointments...
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    return res.json({ success: true, appointments });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

//api to cancel appointment...
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    //verfy appointment user..
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

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



//api to make payment for appointment using razorpay...
const paymentRazorPay=async(req,res)=>{
     
}

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookappointment,
  listAppointment,
  cancelAppointment,
};
