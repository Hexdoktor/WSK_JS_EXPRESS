import sharp from 'sharp';
import path from 'path';

export const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  const inputPath = req.file.path;
  const ext = path.extname(req.file.filename);
  const base = req.file.filename.replace(ext, '');
  const outputPath = `uploads/${base}_thumb.png`;

  try {
    await sharp(inputPath).resize(160, 160).png().toFile(outputPath);

    console.log('Thumbnail created:', outputPath);
  } catch (error) {
    console.error('Thumbnail error:', error);
  }

  next();
};
