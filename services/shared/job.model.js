import mongoose from "mongoose";
const schema = new mongoose.Schema({
 title:{type:String,required:true,trim:true},companyName:{type:String,required:true,trim:true,index:true},
 location:{type:String,default:"Not specified"},jobType:{type:String,enum:["Internship","Full-time","Part-time","Contract","Unknown"],default:"Unknown"},
 experienceLevel:{type:String,default:"Not specified"},requiredSkills:{type:[String],default:[]},isRemote:{type:Boolean,default:false},
 sourceName:{type:String,default:"Mock source"},sourceJobUrl:{type:String,default:""},applicationUrl:{type:String,required:true},
 externalJobId:{type:String,required:true,unique:true},publishedAt:{type:Date,default:null},firstSeenAt:{type:Date,default:Date.now},
 lastSeenAt:{type:Date,default:Date.now},deadline:{type:Date,default:null},status:{type:String,enum:["open","closed","expired"],default:"open",index:true}
},{timestamps:true});
schema.index({status:1,publishedAt:-1});schema.index({companyName:1,status:1});schema.index({title:"text",companyName:"text",location:"text",requiredSkills:"text"});
export const Job=mongoose.models.Job||mongoose.model("Job",schema);
