require("dotenv").config();

const AWS = require("aws-sdk");

const fs = require("fs");

const SES_CONFIG = {
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: "us-east-1",
  apiVersion: "2010-12-01"
};

const AWS_SES = new AWS.SES(SES_CONFIG);

const Source = '"FootyAmigo" <support@footyamigo.com>';
const ReplyToAddresses = ["footyamigo@gmail.com"];
const sendEmail = (recipientEmail, name) => {
  const params = {
    Source,
    ReplyToAddresses,
    Destination: {
      ToAddresses: [recipientEmail]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "This is the body of my email!"
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Hello, Mr ${name}!`
      }
    }
  };
  return AWS_SES.sendEmail(params).promise();
};

const sendTemplateEmail = ({ receiverEmail, Template, TemplateData }) => {
  const params = {
    Source,
    ReplyToAddresses,
    Template,
    Destination: {
      ToAddresses: [receiverEmail]
    },
    TemplateData: JSON.stringify(TemplateData)
  };
  return AWS_SES.sendTemplatedEmail(params).promise();
};

const listTemplates = () => {
  return AWS_SES.listTemplates({ MaxItems: 10 }).promise();
};

const deleteTemplate = TemplateName => {
  return AWS_SES.deleteTemplate({ TemplateName }).promise();
};

const createTemplate = (TemplateName, HtmlPart, SubjectPart) => {
  // Create createTemplate params
  const params = {
    Template: {
      TemplateName,
      HtmlPart,
      SubjectPart
    }
  };
  return AWS_SES.createTemplate(params).promise();
};

const seedTemplates = async () => {
  const forgot_password_template = fs.readFileSync(
    __dirname + "/templates/forgot_password.html",
    "utf-8"
  );
  const account_activation_template = fs.readFileSync(
    __dirname + "/templates/account_activation.html",
    "utf-8"
  );
  const welcome_template = fs.readFileSync(
    __dirname + "/templates/welcome.html",
    "utf-8"
  );
  await deleteTemplate("WELCOME");
  await createTemplate(
    "WELCOME",
    welcome_template,
    "Welcome {{name}} to Footyamigo"
  );
  console.log("WELCOME TEMPLATE CREATED")
  await deleteTemplate("FORGOT_PASSWORD");
  await createTemplate(
    "FORGOT_PASSWORD",
    forgot_password_template,
    "Hello {{name}}, forgot your password?"
  );
  console.log("FORGOT_PASSWORD TEMPLATE CREATED")
  await deleteTemplate("ACCOUNT_ACTIVATION");
  await createTemplate(
    "ACCOUNT_ACTIVATION",
    account_activation_template,
    "Footyamigo account activation [{{code}}]"
  );
  console.log("ACCOUNT_ACTIVATION TEMPLATE CREATED")
};

// seedTemplates();

//sendEmail("beezeaal@gmail.com", "MAIKI")
const email = "beezeaal@gmail.com";
const emailData = { name: "Vishal", code: 261029 };
/*sendTemplateEmail({
  receiverEmail: email,
  Template: "ACCOUNT_ACTIVATION",
  TemplateData: emailData
}).then(data => {
  console.log("SENT", data);
});*/
module.exports = {
  sendEmail,
  sendTemplateEmail
};
