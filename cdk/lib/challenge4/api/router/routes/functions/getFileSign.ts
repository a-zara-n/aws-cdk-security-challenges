import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { RESPONSE_BASE_HEADERS } from './const';
import * as path from 'path';

const s3 = new S3Client({ region: 'ap-northeast-1' });

const RESPONSE_HEADERS = {
  ...RESPONSE_BASE_HEADERS,
  'Access-Control-Allow-Origin': `${process.env.ORIGIN_DOMAIN as string}`,
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
  const { fileId } = event.pathParameters as { fileId: string };

  const decodetFileId = decodeURIComponent(fileId);
  if (decodetFileId.includes('/')) return response(400, JSON.stringify({ message: 'Invalid fileId' }));
  const key = path.normalize(`${id}/${decodetFileId}`);

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME as string,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return response(200, JSON.stringify({ url }));
};
