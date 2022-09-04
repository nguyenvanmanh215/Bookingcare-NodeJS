require('dotenv').config()
import nodemailer from 'nodemailer'
let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Booking Care by Mạnh_IT 👻" <manhnguyen210501@gmail.com>', // sender address
    to: dataSend.reciverEmail, // list of receivers
    subject: 'Thông tin đặt lịch khám bệnh ✔', // Subject line
    html: getBodyHTMLEmail(dataSend), // html body
  })
}
let getBodyHTMLEmail = (dataSend) => {
  let result = ''
  if (dataSend.language === 'vi') {
    result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì bạn đã đặt lịch khám bệnh online trên MDT_BookingCare</p>
        <P>Thông tin đặt lịch khám bệnh :</P>
        <div><b>THời gian:${dataSend.time}</b></div>
        <div><b>Bác sĩ:${dataSend.doctorName}</b></div>
  
        <p>Nếu thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận  và hoàn tất thủ tục đặt lịch khám bệnh.</p>
          <div>
          <a href=${dataSend.redirectLink} target="_blank">Xác nhận</a>
          </div>
        
          <div>Xin chân thành cảm ơn</div>
        `
  }
  if (dataSend.language === 'en') {
    result = `
            <h3>Dear ${dataSend.patientName}!</h3>
            <p>You received this email because you booked an online medical appointment on MDT_BookingCare</p>
            <P>Information to schedule a medical appointment :</P>
            <div><b>Time :${dataSend.time}</b></div>
            <div><b>Doctor :${dataSend.doctorName}</b></div>
      
            <p>
            If the above information is correct, please click on the link below to confirm and complete the appointment booking procedure.</p>
              <div>
              <a href=${dataSend.redirectLink} target="_blank">
              Confirm</a>
              </div>
            
              <div>Sincerely thank!</div>
            `
  }
  return result
}
module.exports = { sendSimpleEmail: sendSimpleEmail }
