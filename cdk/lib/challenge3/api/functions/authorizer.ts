import { APIGatewayAuthorizerHandler, APIGatewayAuthorizerEvent, APIGatewayTokenAuthorizerEvent, APIGatewayRequestAuthorizerEvent, Context } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { denyPolicy, allowPolicy } from './policy';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID as string,
  tokenUse: 'id',
  clientId: process.env.COGNITO_USER_POOL_CLIENT_ID as string,
});

const tokenAuthorizer = async (event: APIGatewayTokenAuthorizerEvent) => {
  const token = event.authorizationToken;

  try {
    const payload = await verifier.verify(token);
    if (!payload) {
      return denyPolicy(event.methodArn, '');
    }
    const id = payload['custom:id'] ?? '';
    const context = {
      id: id,
    };
    return allowPolicy(event.methodArn, context);
  } catch (error) {
    console.log(error);
    return denyPolicy(event.methodArn, '');
  }
};

const requestAuthorizer = async (event: APIGatewayRequestAuthorizerEvent) => {
  return denyPolicy(event.methodArn, '');
};

export const handler: APIGatewayAuthorizerHandler = (event: APIGatewayAuthorizerEvent, context: Context) => {
  if (event.type === 'TOKEN') {
    return tokenAuthorizer(event as APIGatewayTokenAuthorizerEvent);
  }
  return requestAuthorizer(event as APIGatewayRequestAuthorizerEvent);
};
