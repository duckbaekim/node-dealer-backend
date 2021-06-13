/*
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
let s3Storage;

const upload = async (req, res, next) => {
	console.log(req.app.get('AWS_ACCESS_KEY'));
	const s3 = new AWS.S3({
		accessKeyId: req.app.get('AWS_ACCESS_KEY'),
		secretAccessKey: req.app.get('AWS_SECRET_ACCESS_KEY'),
		region: req.app.get('AWS_REGION')
	});

	console.log(s3);

	let params = {
		Bucket: req.app.get('AWS_BUCKER'),
		ACL: 'public-read-write',
		Key: 'dealers/businessCard/',
	};
	
	// s3.js
	s3Storage = multerS3({
		s3: s3,
		bucket: params.Bucket,
		key: function(request, file, cb) {
			console.log("-----------------------asdf");
			console.log(file);
			console.log("-----------------------asdf");
			let extension = path.extname(file.originalname);
			let basename = path.basename(file.originalname, extension);
			cb(null, `images/${basename}-${Date.now()}${extension}`);
		},
		acl: 'public-read-write',
		contentDisposition: 'attachment',
		serverSideEncryption: 'AES256'
	});

	next();
	
}


exports.upload = multer({ storage: s3Storage });
*/

const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const path = require("path");
aws.config.loadFromPath(path.join(__dirname, "../config/aws_config.json"));
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "caroom-storage/dealers/businessCard",
    acl: "public-read",
    key: function (req, file, cb) {
      //console.log("---------- s3 req ------------");
      //console.log(req);
      console.log("---------- s3 file ------------");
      console.log(file);
      cb(null, Date.now() + "." + file.originalname.split(".").pop());
    },
  }),
});

module.exports = upload;
