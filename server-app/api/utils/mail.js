const nodemailer = require('nodemailer')

const sendEmail = async(email, password) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'gradechain.pddikti@gmail.com',
            pass: 'lxeupcagwsdkavka'
            }
        });

        console.log("Haloo")
        var text = `Berikut ini adalah akun untuk website gradechain\n email: ${email}\n Password: ${password}`
        var mailOptions = {
        from: 'gradechain@gmail.com',
        to: 'hadifafarzana@gmail.com',
        subject: 'Password Akun Gradechain',
        text: text
        };
        console.log("send")
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("gagal");
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
    } catch (error) {
        console.log("Error")
    }
 
}


module.exports = {sendEmail}