const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');

const { sign } = require('../lib/jwt');
const MyError = require('../lib/MyError');
const { CANNOT_FIND_USER, INVALID_PASSWORD, EMAIL_EXISTED, INVALID_SIGN_UP_INFO } = require('../lib/errorCode');
const nodemailer = require('nodemailer');

const fs = require('fs');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const employerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    job: [{ type: Schema.Types.ObjectId, ref: 'Job' }]
});

const EmployerModel = mongoose.model('Employer', employerSchema);

class Employer extends EmployerModel {
    static async signUp(email, password, address, phone, name) {
        if (typeof password !== 'string') throw new MyError('Password is required.', INVALID_PASSWORD, 400);
        const encrypted = await hash(password, 8);
        const employer = new EmployerModel({ email, password: encrypted, address, phone, name });
        await employer.save()
            .catch(error => {
                if (error.code === 11000) throw new MyError('Email existed.', EMAIL_EXISTED, 400);
                throw new MyError('Invalid sign up info.', INVALID_SIGN_UP_INFO, 400);
            });
        const employerInfo = employer.toObject();
        delete employerInfo.password;
        return employerInfo;
    }

    static async signIn(email, password) {
        const employer = await Employer.findOne({ email });
        if (!employer) throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404);
        const same = await compare(password, employer.password)
            .catch(() => { throw new MyError('Invalid password.', INVALID_PASSWORD, 400); });
        if (!same) throw new MyError('Invalid password.', INVALID_PASSWORD, 400);
        const employerInfo = employer.toObject();
        const token = await sign({ _id: employer._id });
        employerInfo.token = token;
        delete employerInfo.password;
        return employerInfo;
    }

    static async check(idUser) {
        const employer = await Employer.findById(idUser)
            .catch(() => { throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404); });
        if (!employer) throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404);
        const employerInfo = employer.toObject();
        const token = await sign({ _id: employerInfo._id });
        employerInfo.token = token;
        employerInfo.role = 'employer';
        delete employerInfo.password;
        return employerInfo;
    }

    static async updateEmployer(idEmployer, email, password, address, phone, name) {
        const employer = await Employer.findByIdAndUpdate(idEmployer, { email, password, address, phone, name }, { new: true })
        const employerInfo = employer.toObject();
        delete employer.password;
        return employerInfo;
    }

    static async getEmployer() {
        const employer = await Employer.find({}, { password: 0 })
            .catch(() => { throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404); });
        console.log(employer);
        return employer;
    }

    static async SendEmail(payload) {
        console.log(payload);
        const idEmployer = payload.idEmployer;
        const employer = await Employer.findOne({ _id: idEmployer })
            .catch(() => { throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404); });
        if (!employer) throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404);
        const employerInfo = employer.toObject();
        console.log(employerInfo);


        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                service: 'Gmail',
                user: payload.email,
                pass: payload.password
            },
        });

        var attachments = [
            { 
                filename: payload.filename, 
                path: '../server/public/' + payload.filename, 
            }
        ];

        // // setup email data with unicode symbols
        var mailOptions = {
            // headers: {
            //     'Content-Type': 'text/html'
            // },
            from: payload.email, // sender address
            to: employerInfo.email, // list of receivers
            subject: 'Hello ✔', // Subject line
            // text: payload.introduce, // plain text body
            html: `<h4> Hello, My name is ${payload.name}. <br> ${payload.introduce} <br>
                    Here is my CV: <br>
                    </h4>`,
            attachments: attachments
        };

        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return Promise.reject(error);
            } else {
                return Promise.resolve('Email sent: ' + info.response);
            }
        });


    }
}

module.exports = Employer;