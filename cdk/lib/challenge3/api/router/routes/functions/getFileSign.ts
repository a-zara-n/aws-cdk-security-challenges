import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { RESPONSE_BASE_HEADERS } from './const';
import * as path from 'path';

const s3 = new S3Client({ region: 'ap-northeast-1' });
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { fileId } = event.pathParameters as { fileId: string };
  const key = path.normalize(`${decodeURIComponent(fileId)}`);
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME as string,
    Key: key,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 60 });
  return {
    statusCode: 200,
    headers: {
      ...RESPONSE_BASE_HEADERS,
      'Access-Control-Allow-Origin': `${process.env.ORIGIN_DOMAIN as string}`,
    },
    body: JSON.stringify({
      url: url,
    }),
  };
};
