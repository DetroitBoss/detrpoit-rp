import nodemailer from 'nodemailer'

export class Mail {
    private static transporter = nodemailer.createTransport({
        host: "connect.smtp.bz",
        port: 465,
        secure: true,
        auth: {
            user: 'ermit_123@mail.ru',
            pass: "TUGultSD3lLb"
        }
    });
    static sendMail(fromName: string, to: string, subject: string, text: string){
        this.transporter.sendMail({
            //from: `${fromName} <no-reply@onyx-gta.ru>`, // sender address
            from: 'no-reply@exsight-rp.com', // sender address
            to, // list of receivers
            subject, // Subject line
            text: text, // plain text body
            //html: "<b>Hello world?</b>" // html body
        });
    }
}