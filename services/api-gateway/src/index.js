import "dotenv/config";import express from "express";import cors from "cors";import helmet from "helmet";
const app=express(),port=Number(process.env.PORT||4000);app.disable("x-powered-by");
app.use(helmet({crossOriginResourcePolicy:{policy:"cross-origin"}}));app.use(cors({origin:(process.env.WEB_ORIGIN||"http://localhost:5173").split(","),credentials:true}));app.use(express.json({limit:"1mb"}));
app.get("/api/health",(_req,res)=>res.json({service:"api-gateway",status:"ok",timestamp:new Date().toISOString()}));
async function forward(req,res,base,prefix){try{const response=await fetch(new URL(prefix+req.url,base),{method:req.method,headers:{"content-type":req.headers["content-type"]||"application/json",...(req.headers.authorization?{authorization:req.headers.authorization}:{})},body:["GET","HEAD"].includes(req.method)?undefined:JSON.stringify(req.body??{})});const content=await response.text();res.status(response.status);if(response.headers.get("content-type"))res.set("content-type",response.headers.get("content-type"));res.send(content)}catch(e){console.error("[gateway] upstream:",e.message);res.status(502).json({error:"UPSTREAM_UNAVAILABLE"})}}
app.use("/api/auth",(req,res)=>forward(req,res,process.env.AUTH_SERVICE_URL||"http://localhost:4101","/auth"+req.url));
app.use("/api/companies",(req,res)=>forward(req,res,process.env.USER_SERVICE_URL||"http://localhost:4102","/companies"+req.url));
app.use("/api/jobs",(req,res)=>forward(req,res,process.env.JOB_SERVICE_URL||"http://localhost:4103","/jobs"+req.url));
app.use((err,_req,res,_next)=>{console.error("[gateway] error:",err);res.status(500).json({error:"INTERNAL_ERROR"})});app.listen(port,()=>console.log("[api-gateway] listening on "+port));
