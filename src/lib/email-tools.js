import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_KEY)

export const sendRegistrationEmail = async (recipientAddress) => {
  // send email to recipient

  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Author created successfully!",
    text: "if you see this it means the creation process was successful",
    html: " Author was successfully created. If you see this it means the creation process was successful, and I am super proud of myself",
  }

  await sgMail.send(msg)
}
