const nodemailer = require("nodemailer");
require('dotenv').config();

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user:process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Taking care of you 👻" <duykhanh.longcang@gmail.com>', 
    to: dataSend.reciverEmail, 
    subject: "Thông tin đặt lịch khám bệnh", 
    html: getBodyLanguage(dataSend)
  });
}

let sendSimpleEmailRemedy = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user:process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Taking care of you 👻" <duykhanh.longcang@gmail.com>', 
    to: dataSend.email, 
    subject: "Kết quả đặt lịch khám bệnh", 
    html: getBodyLanguageRemedy(dataSend),
    attachments: {
      filename: `${dataSend.patientId}-${new Date().getTime()}.png`,
      content: dataSend.imgBase64.split("base64,")[1],
      encoding: 'base64'
    }
  });
}

let getBodyLanguageRemedy= (dataSend) => {
  let result
  if(dataSend.language === 'vi') {
    result = `
        <h3>Xin chào ${dataSend.lastName} ${dataSend.firstName}</h3>
        <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ đặt lịch khám tại Booking Care</p>
        <p>Sứ mệnh của Booking Care là mang lại sự kết nối nhanh chóng, chuyên nghiệp và trải nghiệm tốt nhất về y tể cho người dùng . 
        </p> 
        <p>
        Phía dưới đây là đơn thuốc và kết quả khám bệnh của bạn. Nếu bạn có bất kì thắc mắc về kết quả và đơn thuốc, vui lòng phản hồi lại mail này để đội ngũ Booking Care có thể hỗ trợ bạn kịp thời.
        </p>
        <div>Booking Care chân thành cảm ơn!!!</div>
    `
  }
  if(dataSend.language === 'en') {
    result = `
    <h3>Hello ${dataSend.lastName} ${dataSend.firstName}</h3>
    <p>Thank you for trusting and using the appointment booking service at Booking Care</p>
    <p>
    Booking Care's mission is to bring fast, professional connectivity and the best medical experience to users. 
    </p> 
    <p>
    Below are your prescriptions and medical examination results. If you have any questions about results and prescriptions, please reply to this email so that the Booking Care team can assist you promptly.
    </p>
    <div>Booking Care sincerely thanks!!!</div>
    `
  }
  return result
}

let getBodyLanguage = (dataSend) => {
  let result
  if(dataSend.language === 'vi') {
    result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Chúng tôi đã nhận được thông tin đặt lịch khám bệnh của quý khách !!!</p>
        <p>Thông tin đặt lịch khám bệnh : </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu thông tin trên là đúng sự thật, quý khách vui lòng click vào đường lên bên dưới để xác nhận
        và hoàn thành thủ tục.
        </p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank" >Click here!!!</a>
        </div>
        <div>Xin chân thành cảm ơn quý khách!!!</div>
    `
  }
  if(dataSend.language === 'en') {
    result = `
      <h3>Dear ${dataSend.patientName}</h3>
      <p>We have received your medical appointment booking information !!!</p>
      <p>Information to book a medical appointment : </p>
      <div><b>Time: ${dataSend.time}</b></div>
      <div><b>Doctor : ${dataSend.doctorName}</b></div>
      <p>If the above information is true, please click the link below to confirm
      and complete the procedure.
      </p>
      <div>
          <a href=${dataSend.redirectLink} target="_blank" >Click here!!!</a>
      </div>
      <div>Thank you very much!!!</div>
    `
  }
  return result
}

module.exports = {
    sendSimpleEmail,
    sendSimpleEmailRemedy
}