import mongoose from "mongoose";
const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },            
    price: { type: Number, required: true },
    category:{type:String,
        enum:[
            "Editing & Post Production",
      "Social & Marketing",
      "Presenter Videos",
      "Explainer Videos",
      "Animation",
      "Product Videos",
      "Motion Graphics",
      "Filmed Video Production",
      "Miscellaneous"
        ],
        required: true,
        index: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },

});

const Gigs = mongoose.models.Gigs || mongoose.model("Gigs", gigSchema);
export default Gigs;
