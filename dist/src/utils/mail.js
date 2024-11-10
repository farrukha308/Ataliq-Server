"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const client = require('@sendgrid/mail');
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, value, bcc }) {
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
        let data = yield client.send(message);
        return 'Mail sent successfully';
    }
    catch (e) {
        console.error(e);
        (0, logger_1.auditLog)("error in sending mail");
    }
});
const sendBingoMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, value }) {
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
        let data = yield client.send(message);
        return 'Mail sent successfully';
    }
    catch (e) {
        console.error(e);
        (0, logger_1.auditLog)("error in sending mail");
    }
});
const addTemplatePlugins = (_a) => __awaiter(void 0, [_a], void 0, function* ({ plugins, template }) {
    let keys = Object.keys(plugins);
    for (let i = 0; i < keys.length; i++) {
        let regex = new RegExp('{' + keys[i] + '}', 'g');
        template = template.replace(regex, plugins[keys[i]]);
    }
    return template;
});
module.exports = { sendMail, addTemplatePlugins, sendBingoMail };
//# sourceMappingURL=mail.js.map