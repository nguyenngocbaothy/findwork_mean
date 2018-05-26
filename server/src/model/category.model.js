const mongoose = require('mongoose');
const MyError = require('../lib/MyError');

const { NAME_CATEGORY_EXISTED, INVALID_CATEGORY_INFO } = require('../lib/errorCode');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    // categories: [
    //     {  
           name: { type: String, require: true, unique: true }
    //     }
    // ]
});

const CategoryModel = mongoose.model('Category', CategorySchema);
module.exports = CategoryModel;

class Category extends CategoryModel {
    static async addCategory(name) {
        const newcategory = new CategoryModel({ name });
        await newcategory.save()
        .catch(error => {
            if (error.code === 11000) throw new MyError('Name of category is existed.', NAME_CATEGORY_EXISTED, 400);
            throw new MyError('Invalid category info', INVALID_CATEGORY_INFO, 400);
        })
       
        const categoryInfo = newcategory.toObject();
        return categoryInfo;
    }

    static async getCategory() {
        const cate = CategoryModel.find({}).sort({name: 1})
        .catch(error => { throw new MyError('Cannot get category.', 'INVALID_CATEGORY_INFO', 404); })
        if(!cate) throw new MyError('Cannot get category.', 'INVALID_CATEGORY_INFO', 404);

        return cate;
    }
}

module.exports = Category;