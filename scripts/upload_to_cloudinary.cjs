const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET
});

const uploadAssets = async () => {
  const assetPatterns = [
    'public/videos/**/*.{mp4,webm}',
    'public/models/**/*.{glb,gltf,bin,jpg,png}',
    'src/assets/**/*.{png,jpg,jpeg,svg,webp}',
    'public/*.{svg,png,jpg,ico}'
  ];

  const files = await glob(assetPatterns, { nodir: true });
  console.log(`Found ${files.length} files to upload.`);

  const results = {};

  for (const file of files) {
    let resourceType = 'auto';
    if (file.match(/\.(mp4|webm|mov|avi)$/i)) {
      resourceType = 'video';
    } else if (file.match(/\.(gltf|bin|glb)$/i)) {
      resourceType = 'raw';
    }
    const folder = 'iot-club/' + path.dirname(file).replace(/^public\//, '').replace(/^src\/assets/, 'assets');
    const publicId = path.basename(file, path.extname(file));

    try {
      console.log(`Uploading ${file}...`);
      const result = await cloudinary.uploader.upload(file, {
        resource_type: resourceType,
        folder: folder,
        public_id: publicId,
        use_filename: true,
        unique_filename: false,
        overwrite: true
      });
      results[file] = {
        url: result.secure_url,
        public_id: result.public_id
      };
      console.log(`Successfully uploaded ${file}: ${result.secure_url}`);
    } catch (error) {
      console.error(`Failed to upload ${file}:`, error.message);
    }
  }

  fs.writeFileSync('cloudinary_assets.json', JSON.stringify(results, null, 2));
  console.log('Upload complete. Results saved to cloudinary_assets.json');
};

uploadAssets();
