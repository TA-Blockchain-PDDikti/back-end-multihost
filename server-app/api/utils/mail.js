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

        var text = `Berikut ini adalah akun untuk website Gradechain\n email: ${email}\n Password: ${password}`
        var mailOptions = {
        from: 'gradechain@gmail.com',
        to: 'hadifafarzana@gmail.com',
        subject: 'Password Akun Gradechain',
        text: text
        };
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