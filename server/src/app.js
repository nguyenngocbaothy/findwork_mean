const express = require('express');
const app = express();
const parser = require('body-parser');
const multer = require('multer');

const { employerRouter } = require('../src/controller/employer.route')
const { userRouter } = require('../src/controller/user.route')
const { jobRouter } = require('../src/controller/job.route');
const { categoryRouter } = require('../src/controller/category.route');

//app.use(parser.urlencoded({ extended: false }));
app.use(parser.json()); 
app.use(express.static('public'));


// upload file
const storage = multer.diskStorage({
    destination: './public',
    filename: function ( req, file, cb ) {
        cb( null, file.originalname);
    }
});
app.use(multer({
    storage
}).single('file'))
var upload = multer({storage: storage})
app.post('/uploadfile', upload.single("file"),  (req, res) => {
    // console.log(req.file);
    res.send("upload successfully");
});


app.use('/employer', employerRouter);
app.use('/user', userRouter);
app.use('/job', jobRouter);
app.use('/category', categoryRouter);


module.exports = app;