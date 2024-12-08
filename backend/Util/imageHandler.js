// import multer from "multer";
// import sharp from "sharp";
// import path from "path";
// import fs from "fs/promises";

// const UPLOAD_DIR = "uploads/profiles";
// const SIZES = {
// 	thumbnail: 150,
// 	medium: 400,
// 	large: 800,
// };

// await fs.mkdir(UPLOAD_DIR, { recursive: true });

// const storage = multer.memoryStorage(); 

// const fileFilter = (req, file, cb) => {
// 	const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
// 	if (!allowedTypes.includes(file.mimetype)) {
// 		cb(new Error("Invalid file type"), false);
// 		return;
// 	}
// 	cb(null, true);
// };

// const upload = multer({
// 	storage,
// 	fileFilter,
// 	limits: {
// 		fileSize: 5 * 1024 * 1024, // 5MB
// 	},
// });

// const processImage = async (buffer, filename) => {
// 	const promises = Object.entries(SIZES).map(async ([size, width]) => {
// 		const processedImage = await sharp(buffer)
// 			.resize(width, width, {
// 				fit: "cover",
// 				position: "center",
// 			})
// 			.jpeg({ quality: 80 })
// 			.toFile(path.join(UPLOAD_DIR, `${size}_${filename}`));

// 		return processedImage;
// 	});

// 	await Promise.all(promises);
// 	return filename;
// };

// export { upload, processImage };
