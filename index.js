import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from 'path';

const app=express();
const port=3000;

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views")); 


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const config={
    headers : {
        "x-access-token" : "openuv-4ff83hqrm60kjodw-io",
         "Content-Type":  "application/json"
    }
}

let conversion = (minutes) => {
    let hour = Math.floor(minutes / 60); 
    let remain_min = minutes % 60;       
    
    return `${hour} hours and ${remain_min} minutes`;
 }
 
 
 
 
app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.post("/submit",async(req,res)=>{
    console.log(req.body);
    const name=req.body.place;
    
    try {

        const result=await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1`);
        console.log(result.data);
        const latitude=result.data.results[0].latitude;
        const longitude=result.data.results[0].longitude;
        const elevation=result.data.results[0].elevation;


        const response=await axios.get(`https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}&alt=${elevation}&dt=`,config);
        console.log(response.data);
       let str1= conversion(response.data.result.safe_exposure_time.st1)
       let str2= conversion(response.data.result.safe_exposure_time.st2)
       let str3= conversion(response.data.result.safe_exposure_time.st3)
       let str4= conversion(response.data.result.safe_exposure_time.st4)
       let str5= conversion(response.data.result.safe_exposure_time.st5)
       let str6= conversion(response.data.result.safe_exposure_time.st6)
       let sliced=response.data.result.sun_info.sun_times.goldenHourEnd.substring(11,19);
       let sliced1=response.data.result.sun_info.sun_times.goldenHour.substring(11,19);
       res.render("index.ejs",{content : response.data, st1 : str1,st2:str2,st3:str3,st4:str4,st5:str5,st6:str6,slice : sliced,slice1:sliced1});
        
    } catch (error) {
        res.status(400).send(error.message);
    }
})
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})
