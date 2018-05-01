const mongoose = require('mongoose');
const Employer = require('../model/employer.model');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    location: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    detail: {
        description: { 
            type: String, 
            require: true 
        },
        requirement: { 
            type: String, 
            require: true 
        },
        benefit: { 
            type: String, 
            require: true 
        }
    },
    employer: { type: Schema.Types.ObjectId, ref: 'Employer' }
});

const JobModel = mongoose.model('Job', jobSchema);
module.exports = JobModel;

class Job extends JobModel {
    static async addJob(employerId, location, title, salary, description, requirement, benefit) {
        const objectDetail =  {
            "description": description,
            "requirement": requirement,
            "benefit": benefit
        };
        const newJob = new JobModel({ location, title, salary, detail: objectDetail, employer: employerId })
        await newJob.save()
        .catch(error => {
            throw new MyError('Invalid job info', INVALID_JOB_INFO, 400);
        })
        const jobInfo = newJob.toObject();

        // add job to array job of employer
        const employerUpdade = await Employer.findByIdAndUpdate(employerId, { $addToSet: { job:  jobInfo._id} })
        // .then(employerUpdade => {
        //     //console.log(employerUpdade);
        //     console.log(employerUpdade.populate('job'));
        // })
        .catch(error => { throw new Error('Cannot find user.'); });
        if (!employerUpdade) throw new MyError('Cannot find user.', 'CANNOT_FIND_USER', 404);

        return jobInfo; 
    }

    static async getJobByIdEmployer(employerId) {
        const employer = await Employer.findById(employerId).populate('job')
        .catch(error => { throw new Error('Cannot find user.'); });
        if (!employer) throw new MyError('Cannot find user.', 'CANNOT_FIND_USER', 404);

        return employer.job;
    }

    static async updateJobById(jobId, employerId, location, title, salary, description, requirement, benefit) {
        // console.log(jobId, employerId, location, title, salary, description, requirement, benefit);
        const objectDetail =  {
            "description": description,
            "requirement": requirement,
            "benefit": benefit
        };
        const newJob = await Job.findOneAndUpdate({ _id: jobId, employer: employerId }, { location, title, salary, detail: objectDetail }, { new: true })
        .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
        if (!newJob) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);
        
        return newJob;
    }

    static async deleteJobById(jobId, employerId) {
        const job = await Job.findOneAndRemove({ _id: jobId, employer: employerId })
        .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
        if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);
        
        return job;
    }
}

module.exports = Job;