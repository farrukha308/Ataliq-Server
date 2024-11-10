import { auditLog } from "./logger";

const client = require('@sendgrid/mail');

interface sendMailType {
  to: string,
  subject: string,
  value: string,
  bcc: string[],
}

interface sendBingoMailType {
  to: string,
  subject: string,
  value: string,
}

const sendMail = async ({ to, subject, value,bcc}: sendMailType) => {
      try {
        console.log("to--->", to);
        client.setApiKey(process.env.SENDGRID_API_KEY);
        
        const message = {
          personalizations: [
            {
                to: [
                    {
                        email: to
                    }
                ],
                bcc: !bcc ? [] : bcc.map(email => ({ email })),
             },
        ],
          from: {
            email: 'support@stormfutbol.net',
            name: 'Storm Futbol'
          },
          subject,
          content: [
            {
              type: 'text/html',
              value
            }
          ]
        };
        
        let data = await client.send(message);
        return 'Mail sent successfully';
      } catch(e) {
        console.error(e);
        auditLog("error in sending mail");
      }
};
const sendBingoMail = async ({ to, subject, value}: sendBingoMailType) => {
  try {
    console.log("to--->", to);
    client.setApiKey(process.env.SENDGRID_API_KEY);
    
    const message = {
      personalizations: [
        {
            to: to
         },
    ],
      from: {
        email: 'support@stormfutbol.net',
        name: 'Storm Futbol'
      },
      subject,
      content: [
        {
          type: 'text/html',
          value
        }
      ]
    };
    
    let data = await client.send(message);
    return 'Mail sent successfully';
  } catch(e) {
    console.error(e);
    auditLog("error in sending mail");
  }
};

const addTemplatePlugins = async ({ plugins, template}: any) => {
  let keys = Object.keys(plugins);

  for(let i=0; i < keys.length; i++) {
      let regex = new RegExp('{' +  keys[i] + '}', 'g');
      template = template.replace(regex, plugins[keys[i]]);
  }
  return template;
}

module.exports = { sendMail, addTemplatePlugins, sendBingoMail }