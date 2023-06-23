import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { RESPONSE_BASE_HEADERS } from './const';

const s3 = new S3Client({ region: 'ap-northeast-1' });

const isAllowedFileSize = (size: number): boolean => {
  return 0 <= size && size <= 10 * 1024 * 1024;
};

const isAllowedFileName = (fileId: string): boolean => {
  return fileId !== undefined && fileId !== '' && !decodeURIComponent(fileId).includes('/');
};

const RESPONSE_HEADERS = {
  ...RESPONSE_BASE_HEADERS,
  'Access-Control-Allow-Origin': `${process.env.ORIGIN_DOMAIN as string}`,
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

const response = (statusCode: number, body: string): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: RESPONSE_HEADERS,
    body,
  };
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { id } = event.requestContext.authorizer as { id: string };
  const { fileId, size } = JSON.parse(event.body as string) as { fileId: string; size: number };

  if (!isAllowedFileSize(size)) return response(400, JSON.stringify({ message: 'File size is too large' }));
  if (!isAllowedFileName(fileId)) return response(400, JSON.stringify({ message: 'Invalid file name' }));

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME as string,
    Key: `${id}/${decodeURIComponent(fileId)}`,
    ContentType: 'application/octet-stream',
    ContentLength: size,
  });
  const url = await getSignedUrl(s3, command, {
    expiresIn: 60,
  });

  return response(200, JSON.stringify({ url }));
};
