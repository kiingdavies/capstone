var multer = require('multer');

//multer.diskStorage() creates a storage space for storing files.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === 'image/gif') {
            cb(null, './files/images/');
        } else {
            cb({ message: 'Format Error. Please Check Your File' }, false)
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
var upload = multer({ storage: storage });
module.exports = upload;