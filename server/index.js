import e from "express";
import bodyParser from "body-parser";
import https from "https"
import { hostname } from "os";
import path from "path";

const app = e()
app.use(bodyParser.urlencoded({extended: true}))

app.get("/",(req,res)=>{
    const options = {
        hostname: "api.wheretheiss.at",
        path: "/v1/satellites/25544",
        method: "GET",
    }
    const request = https.request(options,(response)=>{
        let data = ""
        response.on("data",(chunk)=>{
            data+=chunk
        })
        response.on("end",()=>{
            try{
                const result = JSON.parse(data);
                console.log("result:",result)
                let gmap = "https://www.google.com/maps?q=" + result.latitude +","+result.longitude
                console.log(gmap)
                res.render("index.ejs",{
                    activity: result,
                    gmap: gmap
                })
                console.log("data:",data)
            }catch(error){
                console.error("Failed to parse the data.")
                res.status(500).send("Failed to fetch data")
            }
        })
    })
    request.on("error",(error)=>{
        console.log("error",error.message)
        res.status(500).send("Failed to request data.")
    })
    request.end()
})


function gmaploc(req,res,next){
    const lat = req.body["latitude"]
    const long = req.body["longitude"]
    console.log(lat,long)
    next()
}
// app.get("/submit",(req,res)=>{
//     res.send(gmap)
// })
app.listen(3000,(req,res)=>{
    console.log("Running at 3000.")
})