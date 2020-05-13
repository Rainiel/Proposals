const express = require('express');
const router = express.Router();
const fs   = require('fs');
const multer = require('multer');
const fileService = require('./file.service');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		fs.mkdir(`../src/assets/_fileStorage/section${req.headers.year}-${req.headers.section}/${req.headers.subject}/${req.headers.group_name}`, { recursive: true }, (err) => { 
			if (err) throw err; 
			else {
				cb(null, `../src/assets/_fileStorage/section${req.headers.year}-${req.headers.section}/${req.headers.subject}/${req.headers.group_name}`)
			} 
		});
		
	},
	filename: function (req, file, cb) {
	//   cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
	cb(null, file.originalname)
	  console.log(file)
	}
})

var upload = multer({storage: storage});

// router.get('/',function(req,res){
// 	res.sendFile('sad',{ root: '_fileStorage/section5-2/proposals/code/' } );
//   	console.log(req.headers)
//   	});

router.post('/uploadPhoto',
  	upload.single('photo'), function (req, res, next){
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });
    
    } else {
        console.log('file received successfully');
        return res.send({
          success: true
        })
	}
});

router.post('/uploadFile',
  	upload.single('files'), function (req, res, next){
    if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });
    
    } else {
        console.log('file received successfully');
        return res.send({
          success: true
        })
	}
});

router.get('/getFile/:id', getFile);

module.exports = router;

function getFile(req ,res, next){
	fileService.getFile(req.params.id)
	.then(file => res.json(file))
	.catch(err => next(err));
}


function mkdirpath(dirPath)
{
    if(!fs.accessSync(dirPath, fs.constants.R_OK | fs.constants.W_OK))
    {
        try
        {
            fs.mkdirSync(dirPath);
        }
        catch(e)
        {
            mkdirpath(path.dirname(dirPath));
            mkdirpath(dirPath);
        }
    }
}

