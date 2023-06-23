import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { RESPONSE_BASE_HEADERS } from './const';
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': `${process.env.ORIGIN_DOMAIN as string}`,
    ...RESPONSE_BASE_HEADERS,
  };

  const message = event.requestContext.authorizer?.role === 'admin' ? process.env.FLAG : 'You are not "admin" role.';

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message }),
  };
};
