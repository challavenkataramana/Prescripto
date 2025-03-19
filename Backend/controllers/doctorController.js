import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

//api to change doctor availability from admin frontend
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    console.log(docId);

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    return res.json({ success: true, message: "Availability Changed" });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

//api to get doctors from fronend
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    return res.json({ success: true, doctors });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

//api for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "User not exits" });
    }
    console.log(doctor);
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      console.log(token);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (e) {
    console.log(e);
    return res.json({ success: false, message: e.message });
  }
};

//api to get doctor accounts to doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (e) {
    console.log(e);
    return res.json({ success: false, message: e.message });
  }
};

//api to mark appointment completed..
const appointmentComplted = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    console.log(appointmentId);
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId == docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (e) {
    console.log(e);
    return res.json({ success: false, message: e.message });
  }
};

//api to cancel appointment ..
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId == docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (e) {
    console.log(e);
    return res.json({ success: false, message: e.message });
  }
};

//api to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    return res.json({ success: true, dashData });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

//api to get doctor profile for doctor panel..
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
   const profileData=await doctorModel.findById(docId).select('-password');

   res.json({success:true,profileData});

  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, message: e.message });
  }
};

//api to update doctor profile..
const updateDoctorProfile=async(req,res)=>{
   try {
      const { docId,fees,available,address } = req.body;
      console.log(req.body);
      await doctorModel.findByIdAndUpdate(docId,{fees,address,available});
      res.json({success:true,message:"Profile Updated Sucessfully"});
  
    } catch (e) {
      console.log(e.message);
      return res.json({ success: false, message: e.message });
    }
}

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplted,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile
};
