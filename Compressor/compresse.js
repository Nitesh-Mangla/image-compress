const multer = require('multer');
const sharp = require('sharp');
const path = require("path");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + Date.now() + file.originalname);
//     }
// });

const storage = multer.memoryStorage();

exports.upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 },
});

// exports.compressor = async (req, res) => {
//     try {
//         const inputFile = req.file.path;
//         const outputFile = path.join(
//             __dirname,
//             process.env.COMPRESS_FILE_UPLOAD_PATH,
//             req.file.originalname
//         );
//
//         const fileExtension = path.extname(req.file.originalname).toLowerCase().replace('.', '');
//         await sharp(inputFile).toFormat(fileExtension, {
//             quality: Number(process.env.COMPRESS_QUALITY_PERCENTAGE),
//         }).toFile(outputFile);
//         res.download(outputFile);
//     } catch(e){
//         console.log(e.message);
//     }
// }

exports.compressor = async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const fileExtension = req.file.mimetype.split('/')[1];

        const compressedBuffer = await sharp(fileBuffer)
            .toFormat(fileExtension, {
                quality: Number(process.env.COMPRESS_QUALITY_PERCENTAGE),
            })
            .toBuffer();

        res.set('Content-Type', req.file.mimetype);
        res.set('Content-Disposition', 'attachment; filename=' + req.file.originalname);
        res.send(compressedBuffer);
    } catch(e){
        console.log(e.message);
        res.status(500).send("Something went wrong!");
    }
}
