import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {type:String , required:true},
    email:{type:String , required:true ,unique:true},
    password:{type:String , required:function (){
        return this.provider !== 'credentials';
    },
    image:{type:String , required:false},
    provider:{type:String , required:true,enum:["credentials ","google","github"], default:'credentials'},
}},)

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;