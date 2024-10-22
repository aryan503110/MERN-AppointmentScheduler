import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema({
    title: String,
    startTime: Date,
    endTime: Date,
});

export default mongoose.model("Appointment",appointmentSchema)
