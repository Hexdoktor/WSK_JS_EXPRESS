import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

export const upload = multer({
  dest: 'uploads/',
  limits: {
    filesize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      const error = new Error('Only images and videos are allowed');
      error.status = 400;
      cb(error, false);
    }
  },
});

export const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const inputPath = req.file.path;
  const ext = path.extname(req.file.filename);
  const base = req.file.filename.replace(ext, '');
  const outputPath = `uploads/${base}_thumb.png`;

  try {
    await sharp(inputPath).resize(160, 160).png().toFile(outputPath);

    console.log('Thumbnail created:', outputPath);
  } catch (err) {
    console.error('Thumbnail error:', err);

    const error = new Error('Failed to create thumbnail');
    error.status = 500;
    return next(error);
  }

  next();
};
