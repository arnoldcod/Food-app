import { mongoose } from "mongoose";

 const connectDB = async () => {
    await mongoose.connect('mongodb+srv://arnoldcod:arnoldRutherfordpy5@cluster0.crbur.mongodb.net/Food-delivery').then(()=> console.log('DB Connected'))
}

export default connectDB;