import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ListObjectsV2Command, ListObjectsV2CommandInput, S3Client } from '@aws-sdk/client-s3';
import { RESPONSE_BASE_HEADERS } from './const';

const s3 = new S3Client({ region: 'ap-northeast-1' });

const RESPONSE_HEADERS = {
  ...RESPONSE_BASE_HEADERS,
  'Access-Control-Allow-Origin': `${process.env.ORIGIN_DOMAIN as string}`,
};

const getListObjects = async (
  id: string,
  nextToken?: string,
): Promise<{
  Files?: (string | undefined)[];
  NextToken?: string;
}> => {
  const listObjectsV2CommandInput: ListObjectsV2CommandInput = nextToken
    ? {
        Bucket: process.env.BUCKET_NAME as string,
        MaxKeys: 10,
        ContinuationToken: nextToken,
      }
    : {
        Bucket: process.env.BUCKET_NAME as string,
        MaxKeys: 10,
      };
  if (id !== '') listObjectsV2CommandInput.Prefix = `${id}/`;
  const listObjectsV2Command = new ListObjectsV2Command(listObjectsV2CommandInput);
  const listObjectsV2CommandResult = await s3.send(listObjectsV2Command);

  if (!listObjectsV2CommandResult.Contents) return { Files: [] };

  const files = listObjectsV2CommandResult.Contents.sort((a, b) => {
    if (a.LastModified && b.LastModified) {
      if (a.LastModified < b.LastModified) return 1;
      if (a.LastModified > b.LastModified) return -1;
      return 0;
    }
    return 0;
  })
    .filter((content) => {
      return content.Key?.split('/').length === 1 || (content.Key?.split('/').length === 2 && content.Key?.split('/')[1] !== '');
    })
    .map((content) => {
      return content.Key?.split('/')[1];
    });

  return {
    Files: files,
    NextToken: listObjectsV2CommandResult.NextContinuationToken,
  };
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
  const { nextToken } = event.queryStringParameters || {};

  const { Files, NextToken } = await getListObjects(id, nextToken);
  return response(
    200,
    JSON.stringify({
      files: Files,
      nextToken: NextToken ? NextToken : '',
    }),
  );
};
