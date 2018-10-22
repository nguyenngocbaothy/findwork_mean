export const APICONFIG = {
    BASEPOINT: 'http://localhost:3000/',
    EMPLOYER: {
        LOGIN: 'employer/signin',
        SIGNUP: 'employer/signup'
    },
    USER: {
        LOGIN: 'user/signin',
        SAVEJOB: 'user/savejob/',
        SIGNUP: 'user/signup',
        SENDMAIL: 'employer/email',
        UPLOADFILE: 'uploadfile'
    },
    JOB: {
        ADD: 'job/',
        UPDATE: 'job/',
        DELETE: 'job/'
    },
    DREAMJOB: {
        FIND: 'job/userfindjob/finddreamjob'
    },
    CHECKTOKEN: {
        EMPLOYER_TOKEN: 'employer/check'
    }
};
