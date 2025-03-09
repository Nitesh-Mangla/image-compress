const multer = require('multer');
const sharp = require('sharp');
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + file.originalname);
    }
});

exports.upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 },
});

exports.compressor = async (req, res) => {
    try {
        const inputFile = req.file.path;
        const outputFile = path.join(
            __dirname,
            process.env.COMPRESS_FILE_UPLOAD_PATH,
            req.file.originalname
        );

        const fileExtension = path.extname(req.file.originalname).toLowerCase().replace('.', '');
        await sharp(inputFile).toFormat(fileExtension, {
            quality: Number(process.env.COMPRESS_QUALITY_PERCENTAGE),
        }).toFile(outputFile);
        res.download(outputFile);
    } catch(e){
        console.log(e.message);
    }
}
