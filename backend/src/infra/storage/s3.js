import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../../infra/config/env.js';

export const s3Client = new S3Client({
  region: config.aws.region || 'us-east-1',
  credentials: {
    accessKeyId: config.aws.accessKeyId || 'mock_key',
    secretAccessKey: config.aws.secretAccessKey || 'mock_secret',
  },
});

export const getS3BucketName = () => config.aws.s3Bucket;

/**
 * Shared utility to upload a buffered file directly to S3
 * @param {object} file - The file object from multer
 * @param {string} destinationKey - The S3 path/key to save it under
 * @returns {Promise<string>} The public URL of the uploaded file
 */
export const uploadFileToS3 = async (file, destinationKey) => {
  const command = new PutObjectCommand({
    Bucket: config.aws.s3BucketName,
    Key: destinationKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  return `https://${config.aws.s3BucketName}.s3.${config.aws.region}.amazonaws.com/${destinationKey}`;
};

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Industry Standard: Generate a presigned URL so the client can upload
 * directly to S3, bypassing our Node.js server entirely.
 */
export const generatePresignedUrl = async (
  destinationKey,
  contentType,
  expiresIn = 3600
) => {
  const command = new PutObjectCommand({
    Bucket: config.aws.s3BucketName || 'mock-bucket',
    Key: destinationKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

  return {
    uploadUrl,
    fileUrl: `https://${config.aws.s3BucketName || 'mock-bucket'}.s3.${config.aws.region || 'us-east-1'}.amazonaws.com/${destinationKey}`,
  };
};
