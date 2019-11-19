const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'kingdavies',
    api_key: '316716334214498',
    api_secret: 'Div1XEDprcmytn48_Y39JY4cqjg'
});


exports.uploads = (file) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({ url: result.url, id: result.public_id })
        }, { resource_type: "auto" })
    })
}

