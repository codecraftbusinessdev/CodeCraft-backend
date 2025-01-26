const express = require("express");
var nodemailer = require('nodemailer');
const multer = require('multer');
const app = express();
const axios = require('axios');
const cors = require('cors');
const fontkit = require('@pdf-lib/fontkit');

const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

const dotenv = require('dotenv');
dotenv.config();

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
app.post('/certificatemail',async(req, res) => {

    const certificateno = req.body.certificateno;
    const email = req.body.email;
    const name = req.body.name;
    const gender = req.body.gender;
    const track = req.body.track;
    const duration = req.body.duration;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const certificateIssueDate = req.body.certificate_issue_date;

    console.log(" ");
    console.log("Generating certificate...")

    const existingPdfBytes = fs.readFileSync('./src/updated_empty_certificate.pdf');

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    pdfDoc.registerFontkit(fontkit);

    // Load the custom font
    const r_font = fs.readFileSync('./src/Poppins-Regular.ttf'); // Replace with your font file path
    const regulerFont = await pdfDoc.embedFont(r_font);

    const b_font = fs.readFileSync('./src/Poppins-SemiBold.ttf'); // Replace with your font file path
    const boldFont = await pdfDoc.embedFont(b_font);


    const firstPage = pdfDoc.getPage(0);
    const { width, height } = firstPage.getSize();


    const certificateIdText = certificateno;
    // const internshipTrackSize = 20;
    // const internshipTrackWidth = internshipTrackText.length * (internshipTrackSize / 2);

    firstPage.drawText(certificateIdText,{
        x: 671,
        y: 520,
        color:rgb(0.118, 0.212, 0.325),
        font:boldFont,
        size : 19
    })

    const studentNameText = name;
    const studentNameSize = 40;
    const studentNameWidth = boldFont.widthOfTextAtSize(studentNameText,studentNameSize);

    firstPage.drawText(studentNameText,{
        x: ((firstPage.getWidth()) - studentNameWidth) / 2 ,
        y:320,
        color:rgb(0.882, 0.655, 0.188),
        font:boldFont,
        size : 40
    })
    
    const internshipStartDateText = startdate;
    // const internshipStartDateSize = 20;
    // const internshipStartDateWidth = internshipStartDateText.length * (internshipStartDateSize / 2);

    firstPage.drawText(internshipStartDateText,{
        x: 224,
        y: 222,
        color:rgb(0.118, 0.212, 0.325),
        font:boldFont,
        size : 20
    })

    const internshipEndDateText = enddate;
    // const internshipEndDateSize = 20;
    // const internshipEndDateWidth = internshipEndDateText.length * (internshipEndDateSize / 2);

    firstPage.drawText(internshipEndDateText,{
        x: 380,
        y: 222,
        color:rgb(0.118, 0.212, 0.325),
        font:boldFont,
        size : 20
    })


    const internshipTrackText = "at CODE CRAFT in "+ track +".";
    const internshipTrackSize = 20;
    const internshipTrackWidth = boldFont.widthOfTextAtSize(internshipTrackText,internshipTrackSize);

    firstPage.drawText(internshipTrackText,{
        x: ((firstPage.getWidth()) - internshipTrackWidth) / 2 ,
        y: 192,
        color:rgb(0.118, 0.212, 0.325),
        font:boldFont,
        size : 20
    })

    const issueDateText = certificateIssueDate;
    // const internshipTrackSize = 20;
    // const internshipTrackWidth = internshipTrackText.length * (internshipTrackSize / 2);

    firstPage.drawText(issueDateText,{
        x: 580,
        y: 100,
        color:rgb(0.118, 0.212, 0.325),
        font:regulerFont,
        size : 19
    })


        // Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();

        // Write the PDF bytes to a file
        fs.writeFileSync('./uploads/Certificate.pdf', pdfBytes);
       
        await delay(2000); // Wait for 2000 milliseconds (2 seconds)

        console.log("Generating LOR...")
        const exBytes = fs.readFileSync('./src/empty_lor.pdf');

        const pdfDoc2 = await PDFDocument.load(exBytes);
        pdfDoc2.registerFontkit(fontkit);

        const regulerFont2 = await pdfDoc2.embedFont(r_font);
    
        const boldFont2 = await pdfDoc2.embedFont(b_font);
    

        const firstPage2 = pdfDoc2.getPage(0);

        let pronounce ;
        let pronounce2;
    
        if(gender=="Male"){
            pronounce="he"
            pronounce2="his"
        }else{
            pronounce="she"
            pronounce2="her"
        }


        firstPage2.drawText(certificateno,{
            x: 430,
            y: 648,
            font:boldFont2,
            size : 14
        });

        firstPage2.drawText("I am writing this letter to " + name +" ,",{
             x: 60,
             y: 620,
             font:regulerFont2,
             size : 14
        });

        firstPage2.drawText("For "+ pronounce2+" exceptional performance and dedication during "+ pronounce2 +" tenure",{
             x: 60,
             y: 600,
             font:regulerFont2,
             size : 14
        });

        firstPage2.drawText("as a " + track + " intern at CODECRAFT INFOTECH.",{
             x: 60,
             y: 580,
             font:regulerFont2,
             size : 14
        });

        firstPage2.drawText(pronounce +" has truly impressed me with "+ pronounce2 +" strong work ethic, passion and",{
              x: 60,
              y: 540,
              font:regulerFont2,
              size : 14
        });

        firstPage2.drawText("ability to excel in "+ pronounce2 +" assigned tasks. Throughout "+ pronounce2 +" internship, " + pronounce,{
              x: 60,
              y: 520,
              font:regulerFont2,
              size : 14
        });

        firstPage2.drawText("exhibited remarkable technical skills and a strong understanding of",{
              x: 60,
              y: 500,
              font:regulerFont2,
              size : 14
        });
        firstPage2.drawText("the industry. "+ pronounce +" tackled complex projects with enthusiasm,",{
              x: 60,
              y: 480,
              font:regulerFont2,
              size : 14
        });
        firstPage2.drawText("displaying great problem solving abilities and an aptitude of the",{
              x: 60,
              y: 460,
              font:regulerFont2,
              size : 14
        });
        firstPage2.drawText("learning.",{
              x: 60,
              y: 440,
              font:regulerFont2,
              size : 14
        });

        firstPage2.drawText(pronounce2 + " attention to detail, creativity and willingness to go the extra mile",{
              x: 60,
              y: 400,
              font:regulerFont2,
              size : 14
        });
        firstPage2.drawText("set "+ pronounce2 +" apart from "+ pronounce2 +" peers. Based on "+ pronounce2 +" outstanding performance ",{
              x: 60,
              y: 380,
              font:regulerFont2,
              size : 14
        });
        firstPage2.drawText("and potential, I have no doubt that "+ pronounce +" will continue to thrive and ",{
              x: 60,
              y: 360,
              font:regulerFont2,
              size : 14
        });
        firstPage2.drawText("make significant contributions in "+ pronounce2 +" future endeavors. It is with great",{
              x: 60,
              y: 340,
              font:regulerFont2,
              size : 14
        });
        firstPage2.drawText("pleasure that I recommend "+ pronounce2 +" for any future opportunities or",{
              x: 60,
              y: 320,
              font:regulerFont2,
              size : 14
        });
        firstPage2.drawText("positions "+ pronounce +" may seek.",{
              x: 60,
              y: 300,
              font:regulerFont2,
              size : 14
        });


        const pdfBytes2 = await pdfDoc2.save();

        // Write the PDF bytes to a file
        fs.writeFileSync('./uploads/LOR.pdf', pdfBytes2);
       

        console.log("Sending mail to : " + email + " ...");

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
        html: '<h1 > CODECRAFT INFOTECH </h1> <br><p>Dear ' + name + ',' + '</p><p>We are thrilled to inform you that you completed Internship Program in ' + track +'  at CodeCraft InfoTech! Congratulations on this exciting achievement!</p> <p>The internship is scheduled from ' +  startdate + ' and concluded on the ' + enddate +' resulting in a '+ duration +' duration for the program.</p> <br> <h2> Your Certificate ID : '+ certificateno +'</h2> <p>Your can verify your ceritificate <a href="https://codecraftinfotech.netlify.app">here</a></p><br><p>Thank you, Team CODECRAFT INFOTECH.</p>',
        attachments: [
            {
                filename: 'Certificate.pdf', // <= Here: made sure file name match
                path: './uploads/Certificate.pdf', // <= Here
                contentType: 'application/pdf'
            },
            {
                filename: 'LOR.pdf', // <= Here: made sure file name match
                path: './uploads/LOR.pdf', // <= Here
                contentType: 'application/pdf'
            }
        ]
    };


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email Sent successfully : " + name +  " | " + email);
        }

    })

    res.json({message : "Success"});
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
        html: '<h1 > CODECRAFT INFOTECH </h1> <br><p>Dear ' + name + ',' + '</p> <p>Greetings! We hope this email finds you in good health. We wanted to remind you that the <a href="https://docs.google.com/forms/d/e/1FAIpQLSd5tT6S2TquQRdonSopo3VVskxKkgUr7N2DqJYrFkE9TQMe7Q/viewform?usp=sf_link" >Internship Submission Form</a> is open and available to submit your internship work.</p> <p>Please ensure timely submission of your <a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view?utm_content=DAGU8eRlmEY&utm_campaign=designshare&utm_medium=link&utm_source=viewer" >Internship Tasks</a> in order to be eligible for the Verified Certificate of Completion.</p> <br><h2><a href="https://docs.google.com/forms/d/e/1FAIpQLSd5tT6S2TquQRdonSopo3VVskxKkgUr7N2DqJYrFkE9TQMe7Q/viewform?usp=sf_link"><button style="background-color: #008CBA;">Click here to open submmision form</button></a></h2><p>Please ensure timely submission of your work in order to be eligible for the Verified Certificate. Late submissions will result in a delay in the release of the certificate.<p/><p>The deadline for submission is 11:59 PM IST on ' + enddate +'.</p><p>We appreciate your hard work and dedication to this internship program.</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email send successfully to : " + name + " | " + email);
        }
        res.json({message : "Success"});
    })
});


app.post('/paymentconfirmation',(req, res) => {
    
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
        subject: 'Congratulation, Submission Work & Payment Verified Successfully!!',
        html: '<h1 > CODECRAFT INFOTECH </h1> <br><p>Dear ' + name + ',' + '</p> <p>Greetings! We hope this email finds you in good health. We received your internship submission and we verified it & we also verified your payment successfully.</p> <p>Your internship end date is ' + enddate + ', so we will release your internship completion certificate & LOR after end date of your internship. because we have to maintain records. </p> <p> If you have any query or questions then reply to this mail </p><br><p>Thank you, Team CODECRAFT INFOTECH.</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email send successfully to : " + name + " | " + email);
        }
        res.json({message : "Success"});
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



app.post('/genPdf', async (req, res) => {

    console.log(" ");
    console.log("Generating Offer Letter PDF...");

    const certificate_id = req.body.certificate_id;
    const name = req.body.name;
    const email = req.body.email;
    const track = req.body.track;
    const issuedate = req.body.issuedate;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const duration = req.body.duration;
    

    let noOfTaskToComplete ;

    if(duration=="15 Days"){
        noOfTaskToComplete = "1 Task"
    }

    else if(duration=="1 Month"){
        noOfTaskToComplete = "2 Tasks"
    }

    else if(duration=="2 Month"){
        noOfTaskToComplete = "3 Tasks"
    }

    else if(duration=="3 Month"){
        noOfTaskToComplete = "3 Tasks"
    }

    else if(duration=="6 Month"){
        noOfTaskToComplete = "4 Tasks"
    } 
    else{
        noOfTaskToComplete = "4 Tasks"
    }

    //console.log(certificate_id + name + email + track + issuedate + startdate + enddate)

    try {

        const existingPdfBytes = fs.readFileSync('./src/update_empty_offer_letter.pdf');

        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        pdfDoc.registerFontkit(fontkit);

        // Load the custom font
        const r_font = fs.readFileSync('./src/Poppins-Regular.ttf'); // Replace with your font file path
        const regulerFont = await pdfDoc.embedFont(r_font);

        const b_font = fs.readFileSync('./src/Poppins-SemiBold.ttf'); // Replace with your font file path
        const boldFont = await pdfDoc.embedFont(b_font);


        const firstPage = pdfDoc.getPage(0);
        const { width, height } = firstPage.getSize();

        firstPage.drawText("Date : ", {
            x: 60,
            y: 670,
            font: regulerFont,
            size: 16
        })

        firstPage.drawText(issuedate, {
            x: 110,
            y: 670,
            font: boldFont,
            size: 16
        })


        firstPage.drawText("CT.NO : ", {
            x: 380,
            y: 670,
            font: regulerFont,
            size: 16
        });

        firstPage.drawText(certificate_id, {
            x: 440,
            y: 670,
            font: boldFont,
            size: 16
        });

        firstPage.drawText("Dear", {
            x: 60,
            y: 620,
            font: regulerFont,
            size: 16
        });

        firstPage.drawText(name + " ,", {
            x: 105,
            y: 620,
            font: boldFont,
            size: 16
        });


        firstPage.drawText("We are pleased to offer you the position of ", {
            x: 60,
            y: 580,
            font: regulerFont,
            size: 14
        });

        firstPage.drawText(track, {
            x: 360,
            y: 580,
            font: boldFont,
            size: 14
        });


        firstPage.drawText("Intern at Code Craft. This is an educational internship. As a valued", {
            x: 60,
            y: 560,
            font: regulerFont,
            size: 14
        });

        firstPage.drawText("member of our team, you will have the opportunity to gain hands-on", {
            x: 60,
            y: 540,
            font: regulerFont,
            size: 14
        });
        firstPage.drawText("experience in this field.", {
            x: 60,
            y: 520,
            font: regulerFont,
            size: 14
        });



        firstPage.drawText("The internship is scheduled to commence on the " + startdate + " and", {
            x: 60,
            y: 480,
            font: regulerFont,
            size: 14
        });

        firstPage.drawText("will conclude on the " + enddate + " resulting in a " + duration + " duration for", {
            x: 60,
            y: 460,
            font: regulerFont,
            size: 14
        });

        firstPage.drawText("the program.", {
            x: 60,
            y: 440,
            font: regulerFont,
            size: 14
        });
        firstPage.drawText("You also agree that you will follow all of the company’s policies that", {
            x: 60,
            y: 400,
            font: regulerFont,
            size: 14
        });
        firstPage.drawText("apply to non-employee interns. This letter constitutes the complete", {
            x: 60,
            y: 380,
            font: regulerFont,
            size: 14
        });
        firstPage.drawText("understanding between you and the company regarding your", {
            x: 60,
            y: 360,
            font: regulerFont,
            size: 14
        });
        firstPage.drawText("internship and supersedes all prior discussions or agreements. This", {
            x: 60,
            y: 340,
            font: regulerFont,
            size: 14
        });
        firstPage.drawText("letter may only be modified by a written agreement signed by both of", {
            x: 60,
            y: 320,
            font: regulerFont,
            size: 14
        });
        firstPage.drawText("us.", {
            x: 60,
            y: 300,
            font: regulerFont,
            size: 14
        });
        firstPage.drawText("We eagerly anticipate your commencement of the internship program", {
            x: 60,
            y: 260,
            font: regulerFont,
            size: 14
        });
        firstPage.drawText("at Code Craft and extend our best wishes for a prosperous experience.", {
            x: 60,
            y: 240,
            font: regulerFont,
            size: 14
        });


        // Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();

        // Write the PDF bytes to a file
        fs.writeFileSync('./uploads/Offer_Letter.pdf', pdfBytes);


        console.log("Sending mail to : " + email + " ...");

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
        html: '<h1 > CODECRAFT INFOTECH </h1> <br><p>Dear ' + name + ',' + '</p><p>We are pleased to inform you that you have been selected for the ' + track +' Internship Program at CodeCraft InfoTech! Congratulations on this exciting achievement!</p> <p>As a '+ track +' intern, you will have the opportunity to gain hands-on experience and develop valuable skills that will prepare you for your future career. Our program is designed to challenge you, support your growth, and provide you with a meaningful and rewarding experience.</P> <P>Enclosed with this email, you will find your Offer Letter. We kindly request that you consult the <a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view" >Task Lists Document</a> Document to fully understand your assigned roles and responsibilities during the course of your internship.</P><br><h1>Timeline</h1><h2>Start Date : '+ startdate +'</h2><h2>End Date : '+ enddate +'</h2><h2>Submission : Submit before '+ enddate +'</h2><br><h2>For submission of your completed tasks, a Task Submission Form will be sent to you by a separate email after 10-15 days from now. </h2><br><h2>Once you submit submission form you will receive internship certificate by a mail within 1-2 days.</h2><br><h2><a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view" ><u>Visit Task Link</u></a> and you have to complete any '+ noOfTaskToComplete +' out 5 tasks from your selected domain.</h2><br><h2><a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view"><button style="background-color: #008CBA;">Click here to visit your tasks</button></a></h2>',
        attachments: [
            {
                filename: 'Offer_Letter.pdf', // <= Here: made sure file name match
                path: './uploads/Offer_Letter.pdf', // <= Here
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


    } catch (error) {
        console.error('Error saving PDF:', error);
    }

    res.json({message : "Success"});

});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
