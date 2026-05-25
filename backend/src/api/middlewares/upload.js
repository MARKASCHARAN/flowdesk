import multer from 'multer';

// Memory storage is used because we pipe the files directly to S3
// rather than saving them to the local disk first.
export const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Global 10MB limit (can be overridden)
  },
});
