import mongoose from 'mongoose';

const KidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
  },
  days: {
    type: Array
  }
});



const Kid = mongoose.model("kids", KidSchema);

export default Kid;

