import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RESPONSE_BASE_HEADERS } from './const';

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
  return response(200, JSON.stringify({ message: 'Hello, world!' }));
};
