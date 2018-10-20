const mongoose = require('mongoose');
const Employer = require('../model/employer.model');
const Category = require('../model/category.model');
const MyError = require('../lib/MyError');

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
    company: {
        type: String,
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
    employer: { type: Schema.Types.ObjectId, ref: 'Employer' },
    create: { type: Date, default: Date.now() },
    endDate: { type: Date },
});

const JobModel = mongoose.model('Job', jobSchema);
module.exports = JobModel;

class Job extends JobModel {
    static async addJob(employerId, location, title, salary, description, requirement, benefit, categoryId, company, endDate) {
        const objectDetail =  {
            "description": description,
            "requirement": requirement,
            "benefit": benefit
        };
        const newJob = new JobModel({ category: categoryId, location, title, salary, company, endDate , detail: objectDetail, employer: employerId })
        await newJob.save()
        .catch(error => {
            throw new MyError('Invalid job info', INVALID_JOB_INFO, 400);
        })
        const jobInfo = newJob.toObject();

        // add job to array job of employer
        const employerUpdade = await Employer.findByIdAndUpdate(employerId, { $addToSet: { job: jobInfo._id} })
        // .then(employerUpdade => {
        //     //console.log(employerUpdade);
        //     console.log(employerUpdade.populate('job'));
        // })
        .catch(error => { throw new Error('Cannot find user.'); });
        if (!employerUpdade) throw new MyError('Cannot find user.', 'CANNOT_FIND_USER', 404);

        return jobInfo; 
    }

    // Thiết_kế work list Emoloyer
    // (2) Xử lý lấy dữ liệu công việc
    // 3. Xử lý lấy dữ liệu
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

    static async searchJob(keyword, category, location) {
        if(keyword !== '' && category !=='' && location !== ''){
            const cate = await Category.findOne({name : category})
            .catch(error => { throw new MyError('Cannot get category.', 'INVALID_CATEGORY_INFO', 404); })
            if(!cate) throw new MyError('Cannot get category.', 'INVALID_CATEGORY_INFO', 404);

            const job = await Job.find({$and: [{ title: {$regex: keyword} }, { location: {$regex: location}}, { category: cate._id }] })
            .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
            if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);

            return job;
        }
        if(keyword == '' && category !=='' && location !== ''){
            const cate = await Category.findOne({name : category})
            .catch(error => { throw new MyError('Cannot get category.', 'INVALID_CATEGORY_INFO', 404); })
            if(!cate) throw new MyError('Cannot get category.', 'INVALID_CATEGORY_INFO', 404);

            const job = await Job.find({$and: [{ location: {$regex: location}}, { category: cate._id } ] })
            .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
            if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);

            return job;
        }
        if(keyword !== '' && category =='' && location !== ''){
            const job = await Job.find({$and: [{ title: {$regex: keyword} }, { location: {$regex: location} }] })
            .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
            if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);

            return job;
        }
        if(keyword !== '' && category !=='' && location == ''){
            const cate = await Category.findOne({name : category})
            .catch(error => { throw new MyError('Cannot get category.', 'INVALID_CATEGORY_INFO', 404); })
            if(!cate) throw new MyError('Cannot get category.', 'INVALID_CATEGORY_INFO', 404);

            const job = await Job.find({$and: [{ title: {$regex: keyword} }, { category: cate._id }] })
            .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
            if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);

            return job;
        }
        if(keyword == '' && category =='' && location !== ''){
            const job = await Job.find({ location: {$regex: location}} )
            .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
            if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);

            return job;
        }
        if(keyword !== '' && category =='' && location == ''){
            const job = await Job.find({title: {$regex: keyword} })
            .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
            if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);

            return job;
        }
        if(keyword == '' && category !=='' && location == ''){
            const cate = await Category.findOne({name : category})
            .catch(error => { throw new MyError('Cannot get category.', 'INVALID_CATEGORY_INFO', 404); })
            if(!cate) throw new MyError('Cannot get category.', 'INVALID_CATEGORY_INFO', 404);


            const job = await Job.find({ category: cate._id })
            .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
            if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);

            return job;
        }
        if(keyword == '' && category =='' && location == ''){
            const job = await Job.find({})
            .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
            if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);

            return job;
        }
    
    }

    static async getAll() {
        const job = await Job.find({}).sort({_id: -1})
        .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
        if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);

        return job;
    }

    static async getJobById(jobId) {
        const job = await Job.findOne({_id: jobId})
        .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
        if (!job) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);

        return job;
    }

    static async findDreamJob(payload) {
        // console.log(payload);
        const jobs = await Job.find({}, { password: 0 })
        .catch(() => { throw new MyError('Cannot find job.', CANNOT_FIND_JOB, 404); });
        // console.log(jobs);

        let totalWeight = 0;
        totalWeight += payload.findJobNumberTitle + payload.findJobNumberLocation + payload.findJobNumbersalary 
            + payload.findJobNumberCategory + payload.findJobNumberCompany
            + payload.findJobNumberExperience + payload.findJobNumberLevel
            + payload.findJobNumberCertificate 
        console.log(totalWeight);

        let totalScoreJob = [];
        if (jobs.length > 0) {
            
            jobs.forEach(e => {
                let score = 0;
                
                if (payload.findJobTitle.toLowerCase().indexOf(e.title.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberTitle / totalWeight;
                    // console.log('title number');
                }
                if (payload.findJobLocation.toLowerCase().indexOf(e.location.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberLocation / totalWeight;
                    // console.log('location number');
                }
                if (payload.findJobSalary === e.salary) {
                    score += 1 * payload.findJobNumbersalary / totalWeight;
                    // console.log('salary number');
                }
                if (JSON.stringify(payload.findJobCategory) === JSON.stringify(e.category)) {
                    score += 1 * payload.findJobNumberCategory / totalWeight;
                    // console.log('cate number');
                }
                if (payload.findJobcompany.toLowerCase().indexOf(e.company.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberCompany / totalWeight;
                    // console.log('company number');
                }
                if (e.detail.requirement.toLowerCase().indexOf(payload.findJobExperience.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberExperience / totalWeight;
                    // console.log('experience number');
                }
                if (e.detail.requirement.toLowerCase().indexOf(payload.findJobLevel.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberLevel / totalWeight;
                    // console.log('level number');
                }
                if (e.detail.requirement.toLowerCase().indexOf(payload.findJobCertificate.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberCertificate / totalWeight;
                    // console.log('certificate number');
                }
               
                // set score for each job
                //e.jobscore = score;
                const data = {
                    '_id': e._id,
                    'category': e.category,
                    'location' : e.location,
                    'title' : e.title,
                    'salary' : e.salary,
                    'company' : e.company,
                    'employer' : e.employer,
                    'jobscore': score,
                    'detail' : {
                        'description' : e.detail.description,
                        'requirement' : e.detail.requirement,
                        'benefit' : e.detail.benefit
                    },
                }
                // console.log(e.jobscore);
                // totalScoreJob.push(e);
                totalScoreJob.push(data);
            });

            // console.log(totalScoreJob);
        }

        totalScoreJob.sort((a, b) => {
            return b.jobscore - a.jobscore;
        })

        // console.log(totalScoreJob);
        return totalScoreJob.slice(0,5);
    }
}

module.exports = Job;