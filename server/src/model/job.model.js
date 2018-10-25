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
    // Thiết_kế Add Job
    // (2) Xử lý thêm công việc
    // (2).3 Xử lí lưu thông tin công việc

    static async addJob(employerId, location, title, salary, description, requirement, benefit,
        categoryId, company, endDate) {
        const objectDetail =  {
            "description": description,
            "requirement": requirement,
            "benefit": benefit
        };
        // (2).3.a Lưu thông tin Job
        const newJob = new JobModel({ category: categoryId, location, title, salary, company, endDate,
            detail: objectDetail, employer: employerId })
        await newJob.save()
        .catch(error => {
            throw new MyError('Invalid job info', INVALID_JOB_INFO, 400);
        })
        const jobInfo = newJob.toObject();

        // (2).3.b Lưu id công việc vào cho nhà tuyển dụng
        // add job to array job of employer
        const employerUpdade = await Employer.findByIdAndUpdate(employerId, {$addToSet: { job: jobInfo._id}})
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

    // Thiết_kế Update Job
    // (2) Xử lý sửa công việc
    // 3. Xử lí cập nhật thông tin công việc
    
    static async updateJobById(jobId, employerId, location, title, salary, description, requirement, benefit) {
        const objectDetail =  {
            "description": description,
            "requirement": requirement,
            "benefit": benefit
        };
       
        const newJob = await Job.findOneAndUpdate({ _id: jobId, employer: employerId },
            { location, title, salary, detail: objectDetail }, { new: true })
        .catch(error => { throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404); });
        // (2).3.a Check hạng mục employerId và jobId
        if (!newJob) throw new MyError('Cannot find job.', 'CANNOT_FIND_JOB', 404);
         
        return newJob;
    }

    // Thiết_kế Delete Job
    // (2) Xử lý xóa công việc
    // (2).3. Xử lí xóa thông tin công việc

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

    // Thiết_kế Find Dream Job User
    // 3. Xử lí tìm kiếm công việc
    // 3.b. Tìm kiếm việc phù hợp
    // 3.b.2
    static async findDreamJob(payload) {
        const jobs = await Job.find({}, { password: 0 })
        .catch(() => { throw new MyError('Cannot find job.', CANNOT_FIND_JOB, 404); });

        // 3.b.3  Tính tổng điểm các tiêu chí mà người tìm việc đã nhập vào biến totalWeight
        let totalWeight = 0;
        totalWeight += payload.findJobNumberTitle + payload.findJobNumberLocation
            + payload.findJobNumbersalary 
            + payload.findJobNumberCategory + payload.findJobNumberCompany
            + payload.findJobNumberExperience + payload.findJobNumberLevel
            + payload.findJobNumberCertificate 

        let totalScoreJob = await this.makeScore(jobs, totalWeight, payload);
        // 4. Server gửi về danh sách top 5 công việc có điểm cao nhất cho client
        if (totalScoreJob) {
            return totalScoreJob.slice(0,5);
        }

        
    }

    // Thiết_kế Find Dream Job User
    // 3. Xử lí tìm kiếm công việc
    // 3.b. Tìm kiếm việc phù hợp
    // 3.b.4 Mỗi công việc khi duyệt được tính theo công thức: tổng điểm  = 1 * ô điểm tương ứng / totalWeight
    static async makeScore(jobs, totalWeight, payload) {
        let totalScoreJob = [];
        if (jobs.length > 0) {
            
            jobs.forEach(e => {
                let score = 0;
                
                if (payload.findJobTitle.toLowerCase().indexOf(e.title.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberTitle / totalWeight;
                }
                if (payload.findJobLocation.toLowerCase().indexOf(e.location.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberLocation / totalWeight;
                }
                if (payload.findJobSalary === e.salary) {
                    score += 1 * payload.findJobNumbersalary / totalWeight;
                }
                if (JSON.stringify(payload.findJobCategory) === JSON.stringify(e.category)) {
                    score += 1 * payload.findJobNumberCategory / totalWeight;
                }
                if (payload.findJobcompany.toLowerCase().indexOf(e.company.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberCompany / totalWeight;
                }
                if (e.detail.requirement.toLowerCase().indexOf(payload.findJobExperience.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberExperience / totalWeight;
                }
                if (e.detail.requirement.toLowerCase().indexOf(payload.findJobLevel.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberLevel / totalWeight;
                }
                if (e.detail.requirement.toLowerCase().indexOf(payload.findJobCertificate.toLowerCase()) !== -1) {
                    score += 1 * payload.findJobNumberCertificate / totalWeight;
                }
               
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

                totalScoreJob.push(data);
                
            });

            const sortScore = this.sortScore(totalScoreJob);
            return sortScore;
        }
    }

    // Thiết_kế Find Dream Job User
    // 3. Xử lí tìm kiếm công việc
    // 3.b. Tìm kiếm việc phù hợp
    // 3.b.5
    static async sortScore(totalScoreJob) {
        return totalScoreJob.sort((a, b) => {
            return b.jobscore - a.jobscore;
        })
    }

}

module.exports = Job;