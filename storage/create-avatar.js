const multer  = require('multer')
const uuid = require('uuid')
const path = require('path')



const storage = multer.diskStorage({
    destination: './avatars',
    filename: (req, file, cb) => {
        cb(null, file.fieldname +'-'+ uuid.v4() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

module.exports = upload