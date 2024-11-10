const express = require("express");
var nodemailer = require('nodemailer');
const multer = require('multer');
const app = express();
const axios = require('axios');
const cors = require('cors');


const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("Server started at port : " + PORT);
});

app.get("/", (req, res) => {

});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'document.pdf');
    },
});

const upload = multer({ storage });

//Offer Letter Email
app.post('/upload', upload.single('file'), (req, res) => {


    const email = req.body.email;
    const name = req.body.name;
    const track = req.body.track;
    const duration = req.body.duration;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;

    console.log("Sending mail to " + email);

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hr.codecraft.infotech@gmail.com',
            pass: 'gnkdjcrplzbrhcgd'
        }
    });

    var mailOptions = {
        from: 'hr.codecraft.infotech@gmail.com',
        to: email,
        subject: 'Congratulations, you have been Selected for the Internship!',
        html: '<h1 > CODECRAFT INFOTECH </h1> <br><p>Dear ' + name + ',' + '</p><p>We are pleased to inform you that you have been selected for the ' + track +' Internship Program at CodeCraft InfoTech! Congratulations on this exciting achievement!</p> <p>As a '+ track +' intern, you will have the opportunity to gain hands-on experience and develop valuable skills that will prepare you for your future career. Our program is designed to challenge you, support your growth, and provide you with a meaningful and rewarding experience.</P> <P>Enclosed with this email, you will find your Offer Letter. We kindly request that you consult the <a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view" >Task Lists Document</a> Document to fully understand your assigned roles and responsibilities during the course of your internship.</P><br><h3>During your internship at CodeCraft InfoTech, please keep in mind the following points:</h3><p>1. It is mandatory that you update your LinkedIn profile and share your Offer Letter on LinkedIn.</p><p>2. Following the completion of each task, it is mandatory that you create a post on LinkedIn outlining the tasks you have completed and the knowledge gained. You may choose to include a video in your post, but it is optional.</p><p>3. It is compulsory that you tag <a href="https://linkedin.com/company/codecraft-infotech">CodeCraftInfoTech</a> and use the hashtag #CodeCraftInfoTech in all posts related to your internship as part of our social media policy.</p><p>4. For submission of your completed tasks, a Task Submission Form will be sent to you by a separate email after 10-15 days from now. You dont need to email your tasks to us.</p><p>5. The internship program is unpaid, and no monetary compensation will be provided. The program offers certificates & LoR upon successful completion of assigned tasks and meeting the program requirements.</p><br><h1>Timeline</h1><h2>Start Date : '+ startdate +'</h2><h2>End Date : '+ enddate +'</h2><h2>Submission : Submit before '+ enddate +'</h2><br><h2>Once you submit submission form you will receive internship certificate by a mail within 1-2 days.</h2><br><h2><a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view"><button style="background-color: #008CBA;">Click here to visit your tasks</button></a></h2>',
        attachments: [
            {
                filename: 'Offer_Letter.pdf', // <= Here: made sure file name match
                path: './uploads/document.pdf', // <= Here
                contentType: 'application/pdf'
            }
        ]
    };


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email send successfully to : " + name + " | " + email);
        }

    })

});


//Certificate Email
app.post('/certificatemail', upload.single('file'), (req, res) => {

    console.log("Request is arrived");

    const email = req.body.email;
    const name = req.body.name;
    const track = req.body.track;
    const duration = req.body.duration;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const certificateno = req.body.certificateno;

    console.log(email);

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hr.codecraft.infotech@gmail.com',
            pass: 'gnkdjcrplzbrhcgd'
        }
    });

    var mailOptions = {
        from: 'hr.codecraft.infotech@gmail.com',
        to: email,
        subject: 'Congratulations, You Successfully Completed Your Internship!',
        html: '<h1 > CODECRAFT INFOTECH </h1> <br><p>Dear ' + name + ',' + '</p><p>We are thrilled to inform you that you completed Internship Program in ' + track +'  at CodeCraft InfoTech! Congratulations on this exciting achievement!</p> <p>The internship is scheduled from ' +  startdate + ' and concluded on the ' + enddate +' resulting in a 1 Month duration for the program.</p> <br> <h2> Your Certificate NO : '+ certificateno +'</h2> <p>Your can verify your ceritificate <a href="https://codecraftinfotech.netlify.app/verify_certificate">here</a></p><br><p>Thank you, Team CODECRAFT INFOTECH.</p>',
        attachments: [
            {
                filename: 'Internship_Certificate.pdf', // <= Here: made sure file name match
                path: './uploads/document.pdf', // <= Here
                contentType: 'application/pdf'
            }
        ]
    };


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("success");
        }

    })

});

//send submission form mail

app.post('/submissionmail',(req, res) => {
    

    const email = req.body.email;
    const name = req.body.name;
    const enddate = req.body.enddate;

    console.log("Sending mail to " + email);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hr.codecraft.infotech@gmail.com',
            pass: 'gnkdjcrplzbrhcgd'
        }
    });

    var mailOptions = {
        from: 'hr.codecraft.infotech@gmail.com',
        to: email,
        subject: 'Internship Submission Form Link for CodeCraft Infotech',
        html: '<h1 > CODECRAFT INFOTECH </h1> <br><p>Dear ' + name + ',' + '</p> <p>Greetings! We hope this email finds you in good health. We wanted to remind you that the <a href="https://docs.google.com/forms/d/e/1FAIpQLSd5tT6S2TquQRdonSopo3VVskxKkgUr7N2DqJYrFkE9TQMe7Q/viewform?usp=sf_link" >Internship Submission Form</a> is open and available for all students to submit their internship work.</p> <p>Please ensure timely submission of your <a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view?utm_content=DAGU8eRlmEY&utm_campaign=designshare&utm_medium=link&utm_source=viewer" >Internship Tasks</a> in order to be eligible for the Verified Certificate of Completion.</p> <br><h2><a href="https://docs.google.com/forms/d/e/1FAIpQLSd5tT6S2TquQRdonSopo3VVskxKkgUr7N2DqJYrFkE9TQMe7Q/viewform?usp=sf_link"><button style="background-color: #008CBA;">Click here to open submmision form</button></a></h2><p>Please ensure timely submission of your work in order to be eligible for the Verified Certificate. Late submissions will result in a delay in the release of the certificate.<p/><p>The deadline for submission is 11:59 PM IST on ' + enddate +'.</p><p>We appreciate your hard work and dedication to this internship program.</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email send successfully to : " + name + " | " + email);
        }

    })
});


app.post('/pdf', async (req, res) => {
    console.log("request arrived");

    const pdfUri = req.body.pdfUri;

    console.log(pdfUri);
    try {
        // Fetch the PDF from the URI
        const response = await axios.get(pdfUri, {
            responseType: 'arraybuffer', // Important for binary data
        });

        // Save the PDF to a file
        fs.writeFileSync("downloaded.pdf", response.data);
        console.log(`PDF saved successfully as downloaded.pdf`);
    } catch (error) {
        console.error('Error saving PDF:', error);
    }

    res.send(pdfUri);

});




