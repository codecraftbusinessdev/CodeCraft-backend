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

    //  user: 'hr.codecraft.infotech@gmail.com',
    //  pass: 'gnkdjcrplzbrhcgd'

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hr.codecraft.info@gmail.com',
            pass: 'pfakrusrcdhhpfsq'
        }
    });

    var mailOptions = {
        from: 'hr.codecraft.info@gmail.com',
        to: email, // This will be the recipient's email address
        subject: `Congratulations ${name}, you have been Selected for the Internship!`,
        // The beautiful, responsive HTML content for the email body
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Internship Offer</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Poppins', Arial, 'Helvetica Neue', Helvetica, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                        background-color: #f7f7f7;
                    }
                    /* All other styles are inlined for maximum email client compatibility */
                </style>
            </head>
            <body style="margin: 0; padding: 20px; background-color: #f7f7f7; font-family: 'Poppins', Arial, 'Helvetica Neue', Helvetica, sans-serif;">
                <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
                    
                    <!-- Header -->
                    <div style="background-color: #004d7a; color: #ffffff; padding: 25px 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">CodeCraft InfoTech</h1>
                    </div>
    
                    <!-- Body -->
                    <div style="padding: 30px 40px;">
                        <h2 style="font-size: 22px; color: #004d7a; margin-top: 0; font-weight: 600;">Welcome Aboard!</h2>
                        <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
                        <p style="font-size: 16px;">Congratulations! We are thrilled to offer you a position for the <strong>${track} Internship Program</strong> at CodeCraft InfoTech. Your skills and passion stood out, and we can't wait to see you grow with us.</p>
                        <p style="font-size: 16px;">This internship is a fantastic opportunity to gain hands-on experience and build a strong foundation for your career. Your official Offer Letter is attached to this email.</p>
                        
                        <!-- Timeline Section -->
                        <div style="background-color: #f0f8ff; border-left: 4px solid #008CBA; padding: 15px 20px; margin: 30px 0; border-radius: 4px;">
                            <h3 style="margin: 0 0 10px 0; color: #004d7a; font-size: 18px; font-weight: 600;">Your Internship Timeline</h3>
                            <p style="margin: 5px 0; font-size: 15px;"><strong>Start Date:</strong> ${startdate}</p>
                            <p style="margin: 5px 0; font-size: 15px;"><strong>End Date:</strong> ${enddate}</p>
                            <p style="margin: 5px 0; font-size: 15px;"><strong>Final Task Submission:</strong> On or before ${enddate}</p>
                        </div>
    
                        <!-- Key Requirements Section -->
                        <div>
                            <h3 style="color: #004d7a; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; font-size: 18px; font-weight: 600;">Program Requirements</h3>
                            <ul style="list-style-type: none; padding-left: 0; font-size: 15px;">
                                <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #008CBA; font-weight: bold; font-size: 18px; top: -2px;">✔</span>
                                    <strong>LinkedIn Profile:</strong> Please update your profile and share your attached Offer Letter on LinkedIn to announce your new role.
                                </li>
                                <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #008CBA; font-weight: bold; font-size: 18px; top: -2px;">✔</span>
                                    <strong>Task Updates:</strong> After completing each task, share a post on LinkedIn about your work and learnings. Tag <a href="https://linkedin.com/company/codecraft-infotech" style="color: #008CBA; text-decoration: none; font-weight: bold;">CodeCraftInfoTech</a> and use the hashtag #CodeCraftInfoTech.
                                </li>
                                <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #008CBA; font-weight: bold; font-size: 18px; top: -2px;">✔</span>
                                    <strong>Task Submission:</strong> A link to the Task Submission Form will be emailed to you in 10-15 days. There is no need to email your tasks to us.
                                </li>
                                <li style="padding-left: 30px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #008CBA; font-weight: bold; font-size: 18px; top: -2px;">✔</span>
                                    <strong>Compensation:</strong> This is an unpaid internship focused on skill development. A Certificate and Letter of Recommendation (LoR) are provided upon successful completion.
                                </li>
                            </ul>
                        </div>
    
                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 40px 0 20px;">
                            <a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view" target="_blank" style="background-color: #008CBA; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">View Your Tasks</a>
                        </div>
    
                        <p style="font-size: 16px;">We're excited to have you on the team!</p>
                        <p style="font-size: 16px; margin-top: 30px;">Best Regards,<br>The Team at CodeCraft InfoTech</p>
                    </div>
    
                    <!-- Footer -->
                    <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} CodeCraft InfoTech. All Rights Reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        attachments: [
            {
                filename: 'Offer_Letter.pdf',
                path: './uploads/document.pdf',
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
            user: 'hr.codecraft.info@gmail.com',
            pass: 'pfakrusrcdhhpfsq'
        }
    });

    var mailOptions = {
        from: 'hr.codecraft.info@gmail.com',
        to: email,
        subject: 'Congratulations on Completing Your Internship at CodeCraft InfoTech!',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Internship Completion</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Poppins', Arial, 'Helvetica Neue', Helvetica, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                        background-color: #f7f7f7;
                    }
                    /* All other styles are inlined for maximum email client compatibility */
                </style>
            </head>
            <body style="margin: 0; padding: 20px; background-color: #f7f7f7; font-family: 'Poppins', Arial, 'Helvetica Neue', Helvetica, sans-serif;">
                <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
                    
                    <!-- Header -->
                    <div style="background-color: #004d7a; color: #ffffff; padding: 25px 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">CodeCraft InfoTech</h1>
                    </div>
    
                    <!-- Body -->
                    <div style="padding: 30px 40px;">
                        <h2 style="font-size: 22px; color: #004d7a; margin-top: 0; font-weight: 600;">A Job Well Done, ${name}!</h2>
                        <p style="font-size: 16px; margin-bottom: 20px;">We are thrilled to congratulate you on the successful completion of your <strong>${track} Internship Program</strong> at CodeCraft InfoTech. Your hard work and dedication have been truly valuable to our team.</p>
                        <p style="font-size: 16px;">We've attached your official Internship Certificate and Letter of Recommendation (LOR) to this email. We hope these documents serve you well in your future endeavors.</p>
                        
                        <!-- Details Section -->
                        <div style="background-color: #f0f8ff; border-left: 4px solid #008CBA; padding: 15px 20px; margin: 30px 0; border-radius: 4px;">
                            <h3 style="margin: 0 0 10px 0; color: #004d7a; font-size: 18px; font-weight: 600;">Your Internship Details</h3>
                            <p style="margin: 5px 0; font-size: 15px;"><strong>Internship Period:</strong> ${startdate} to ${enddate} (${duration})</p>
                            <p style="margin: 5px 0; font-size: 15px;"><strong>Certificate ID:</strong> ${certificateno}</p>
                        </div>
    
                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 40px 0 20px;">
                            <a href="https://codecraftinfotech.netlify.app" target="_blank" style="background-color: #008CBA; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Your Certificate</a>
                        </div>
    
                        <p style="font-size: 16px;">Thank you for your contributions. We wish you the very best in your career journey!</p>
                        <p style="font-size: 16px; margin-top: 30px;">Best Regards,<br>The Team at CodeCraft InfoTech</p>
                    </div>
    
                    <!-- Footer -->
                    <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} CodeCraft InfoTech. All Rights Reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        attachments: [
            {
                filename: 'Certificate.pdf',
                path: './uploads/Certificate.pdf',
                contentType: 'application/pdf'
            },
            {
                filename: 'LOR.pdf',
                path: './uploads/LOR.pdf',
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
            user: 'hr.codecraft.info@gmail.com',
            pass: 'pfakrusrcdhhpfsq'
        }
    });

    var mailOptions = {
        from: 'hr.codecraft.info@gmail.com',
        to: email,
        subject: 'Action Required: Submit Your Internship Tasks | CodeCraft InfoTech',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Internship Task Submission</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Poppins', Arial, 'Helvetica Neue', Helvetica, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                        background-color: #f7f7f7;
                    }
                    /* All other styles are inlined for maximum email client compatibility */
    
                    /* Media query for responsive button */
                    @media screen and (max-width: 600px) {
                        .mobile-full-width-button {
                            width: 100% !important;
                            display: block !important;
                        }
                        .mobile-button-cell {
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                        }
                    }
                </style>
            </head>
            <body style="margin: 0; padding: 20px; background-color: #f7f7f7; font-family: 'Poppins', Arial, 'Helvetica Neue', Helvetica, sans-serif;">
                <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
                    
                    <div style="background-color: #004d7a; color: #ffffff; padding: 25px 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">CodeCraft InfoTech</h1>
                    </div>
    
                    <div style="padding: 30px 40px;">
                        <h2 style="font-size: 22px; color: #004d7a; margin-top: 0; font-weight: 600;">Internship Task Submission</h2>
                        <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
                        <p style="font-size: 16px;">We hope you're having a productive internship experience! This email contains the link to the official form for submitting your completed tasks.</p>
                        <p style="font-size: 16px;">Please ensure all your work is submitted via the form to be eligible for your Certificate of Completion.</p>
                        
                        <div style="background-color: #fffbe6; border-left: 4px solid #facc15; padding: 15px 20px; margin: 30px 0; border-radius: 4px;">
                            <h3 style="margin: 0 0 10px 0; color: #b45309; font-size: 18px; font-weight: 600;">Submission Deadline</h3>
                            <p style="margin: 0; font-size: 15px;">All tasks must be submitted by <strong>11:59 PM IST on ${enddate}</strong>.</p>
                        </div>
    
                        <div style="text-align: center; margin: 40px 0 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" class="mobile-full-width-button" style="margin: 0 auto;">
                                <tr>
                                    <td align="center" class="mobile-button-cell" style="background-color: #008CBA; border-radius: 5px;">
                                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSd5tT6S2TquQRdonSopo3VVskxKkgUr7N2DqJYrFkE9TQMe7Q/viewform?usp=sf_link" target="_blank" 
                                           style="font-size: 16px; font-weight: bold; text-decoration: none; color: #ffffff; padding: 15px 30px; display: inline-block; border-radius: 5px;">
                                            Open Submission Form
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </div>
    
                        <p style="font-size: 16px;">We appreciate your hard work and look forward to reviewing your submissions.</p>
                        <p style="font-size: 16px; margin-top: 30px;">Best Regards,<br>The Team at CodeCraft InfoTech</p>
                    </div>
    
                    <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} CodeCraft InfoTech. All Rights Reserved.</p>
                    </div>
                </div>
            </body> 
            </html>
        `,
        attachments: [] // No attachments for this email
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


app.post('/resubmissionmail',(req, res) => {
    
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
        subject: 'Attention: Deadline Extended for Internship Submission Form',
        html: '<h1 > CODECRAFT INFOTECH </h1> <br><p>Dear ' + name + ',' + '</p> <p>Greetings! We hope this email finds you in good health. We wanted to remind you that the <a href="https://docs.google.com/forms/d/e/1FAIpQLSd5tT6S2TquQRdonSopo3VVskxKkgUr7N2DqJYrFkE9TQMe7Q/viewform?usp=sf_link" >Internship Submission Form</a> is open and available to submit your internship work.</p> <p>Please ensure timely submission of your <a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view?utm_content=DAGU8eRlmEY&utm_campaign=designshare&utm_medium=link&utm_source=viewer" >Internship Tasks</a> in order to be eligible for the Verified Certificate of Completion.</p> <br><h2><a href="https://docs.google.com/forms/d/e/1FAIpQLSd5tT6S2TquQRdonSopo3VVskxKkgUr7N2DqJYrFkE9TQMe7Q/viewform?usp=sf_link"><button style="background-color: #008CBA;">Click here to open submmision form</button></a></h2><p>Please ensure timely submission of your work in order to be eligible for the Verified Certificate. Late submissions will result in a delay in the release of the certificate.<p/><p>The extended deadline for submission is 11:59 PM IST on ' + enddate +'.</p><p>We appreciate your hard work and dedication to this internship program.</p>'
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
            user: 'hr.codecraft.info@gmail.com',
            pass: 'pfakrusrcdhhpfsq'
        }
    });

    // var mailOptions = {
    //     from: 'hr.codecraft.infotech@gmail.com',
    //     to: email,
    //     subject: 'Congratulations, you have been Selected for the Internship!',
    //     html: '<h1 > CODECRAFT INFOTECH </h1> <br><p>Dear ' + name + ',' + '</p><p>We are pleased to inform you that you have been selected for the ' + track +' Internship Program at CodeCraft InfoTech! Congratulations on this exciting achievement!</p> <p>As a '+ track +' intern, you will have the opportunity to gain hands-on experience and develop valuable skills that will prepare you for your future career. Our program is designed to challenge you, support your growth, and provide you with a meaningful and rewarding experience.</P> <P>Enclosed with this email, you will find your Offer Letter. We kindly request that you consult the <a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view" >Task Lists Document</a> Document to fully understand your assigned roles and responsibilities during the course of your internship.</P><br><h1>Timeline</h1><h2>Start Date : '+ startdate +'</h2><h2>End Date : '+ enddate +'</h2><h2>Submission : Submit before '+ enddate +'</h2><br><h2>For submission of your completed tasks, a Task Submission Form will be sent to you by a separate email after 10-15 days from now. </h2><br><h2>Once you submit submission form you will receive internship certificate by a mail within 1-2 days.</h2><br><h2><a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view" ><u>Visit Task Link</u></a> and you have to complete any '+ noOfTaskToComplete +' out 5 tasks from your selected domain.</h2><br><h2><a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view"><button style="background-color: #008CBA;">Click here to visit your tasks</button></a></h2>',
    //     attachments: [
    //         {
    //             filename: 'Offer_Letter.pdf', // <= Here: made sure file name match
    //             path: './uploads/Offer_Letter.pdf', // <= Here
    //             contentType: 'application/pdf'
    //         }
    //     ]
    // };

    var mailOptions = {
        from: 'hr.codecraft.info@gmail.com',
        to: email, // This will be the recipient's email address
        subject: `Congratulations ${name}, you have been Selected for the Internship!`,
        // The beautiful, responsive HTML content for the email body
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Internship Offer</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Poppins', Arial, 'Helvetica Neue', Helvetica, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                        background-color: #f7f7f7;
                    }
                    /* All other styles are inlined for maximum email client compatibility */
                </style>
            </head>
            <body style="margin: 0; padding: 20px; background-color: #f7f7f7; font-family: 'Poppins', Arial, 'Helvetica Neue', Helvetica, sans-serif;">
                <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
                    
                    <!-- Header -->
                    <div style="background-color: #004d7a; color: #ffffff; padding: 25px 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">CodeCraft InfoTech</h1>
                    </div>
    
                    <!-- Body -->
                    <div style="padding: 30px 40px;">
                        <h2 style="font-size: 22px; color: #004d7a; margin-top: 0; font-weight: 600;">Welcome Aboard!</h2>
                        <p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>
                        <p style="font-size: 16px;">Congratulations! We are thrilled to offer you a position for the <strong>${track} Internship Program</strong> at CodeCraft InfoTech. Your skills and passion stood out, and we can't wait to see you grow with us.</p>
                        <p style="font-size: 16px;">This internship is a fantastic opportunity to gain hands-on experience and build a strong foundation for your career. Your official Offer Letter is attached to this email.</p>
                        
                        <!-- Timeline Section -->
                        <div style="background-color: #f0f8ff; border-left: 4px solid #008CBA; padding: 15px 20px; margin: 30px 0; border-radius: 4px;">
                            <h3 style="margin: 0 0 10px 0; color: #004d7a; font-size: 18px; font-weight: 600;">Your Internship Timeline</h3>
                            <p style="margin: 5px 0; font-size: 15px;"><strong>Start Date:</strong> ${startdate}</p>
                            <p style="margin: 5px 0; font-size: 15px;"><strong>End Date:</strong> ${enddate}</p>
                            <p style="margin: 5px 0; font-size: 15px;"><strong>Final Task Submission:</strong> On or before ${enddate}</p>
                        </div>
    
                        <!-- Key Requirements Section -->
                        <div>
                            <h3 style="color: #004d7a; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; font-size: 18px; font-weight: 600;">Program Requirements</h3>
                            <ul style="list-style-type: none; padding-left: 0; font-size: 15px;">
                                <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #008CBA; font-weight: bold; font-size: 18px; top: -2px;">✔</span>
                                    <strong>LinkedIn Profile:</strong> Please update your profile and share your attached Offer Letter on LinkedIn to announce your new role.
                                </li>
                                <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #008CBA; font-weight: bold; font-size: 18px; top: -2px;">✔</span>
                                    <strong>Task Updates:</strong> After completing each task, share a post on LinkedIn about your work and learnings. Tag <a href="https://linkedin.com/company/codecraft-infotech" style="color: #008CBA; text-decoration: none; font-weight: bold;">CodeCraftInfoTech</a> and use the hashtag #CodeCraftInfoTech.
                                </li>
                                <li style="margin-bottom: 15px; padding-left: 30px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #008CBA; font-weight: bold; font-size: 18px; top: -2px;">✔</span>
                                    <strong>Task Submission:</strong> A link to the Task Submission Form will be emailed to you in 10-15 days. There is no need to email your tasks to us.
                                </li>
                                <li style="padding-left: 30px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #008CBA; font-weight: bold; font-size: 18px; top: -2px;">✔</span>
                                    <strong>Compensation:</strong> This is an unpaid internship focused on skill development. A Certificate and Letter of Recommendation (LoR) are provided upon successful completion.
                                </li>
                            </ul>
                        </div>
    
                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 40px 0 20px;">
                            <a href="https://www.canva.com/design/DAGU8eRlmEY/E_jP0ALiPMNnz0aYutqQSA/view" target="_blank" style="background-color: #008CBA; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">View Your Tasks</a>
                        </div>
    
                        <p style="font-size: 16px;">We're excited to have you on the team!</p>
                        <p style="font-size: 16px; margin-top: 30px;">Best Regards,<br>The Team at CodeCraft InfoTech</p>
                    </div>
    
                    <!-- Footer -->
                    <div style="background-color: #f1f5f9; color: #64748b; padding: 20px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">&copy; ${new Date().getFullYear()} CodeCraft InfoTech. All Rights Reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        attachments: [
            {
                filename: 'Offer_Letter.pdf',
                path: './uploads/Offer_Letter.pdf',
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
