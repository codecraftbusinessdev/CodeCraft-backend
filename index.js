const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));

const admin = require("firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({
    credential:admin.credential.cert(credentials)
});

const db = admin.firestore();

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log("Server started at port : "+PORT);
});

app.get("/",(req,res)=>{
    
    res.send("Hello i am active");
    
})

app.post("/addFeedback",async(req,res)=>{
    try {
        const feedbackJson = {
            name : req.body.name,
            email : req.body.email,
            subject : req.body.subject,
            message : req.body.message
        };

        const result = await db.collection("feedback").add(feedbackJson);
        res.send(result)
        
        console.log("requested addFeedback");

    } catch (error) {
        res.send(error)
    }
})

app.get("/getAllFeedback",async(req,res)=>{
    try {
        
        const userRef = db.collection("feedback");
        const result = await userRef.where("name", "==", "jone").get();

        let responseArr = [];

        result.forEach(doc=>{
            responseArr.push(doc.data());
        })

        console.log("requested");
        res.send(responseArr);
    } catch (error) {
        res.send(error)
    }
})

app.post("/addCertificate",async(req,res)=>{
    try {
        const certificateJson = {
            certificate_no : req.body.certificate_no,
            name : req.body.name,
            internship_track : req.body.internship_track,
            college : req.body.college,
            LoR : req.body.lor,
            start_date : req.body.start_date,
            end_date : req.body.end_date,
            issue_date : req.body.issue_date,
        };

        const result = await db.collection("certificate").doc(certificateJson.certificate_no).set(certificateJson);
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

app.get("/verifyCertificate/:certificate_id",async(req,res)=>{
    try {
        
        const userRef = db.collection("certificate").doc(req.params.certificate_id);
        const result = await userRef.get();
        res.send(result.data());

        console.log("requested verifyCertificate");


    } catch (error) {
        res.send(error)
    }
})