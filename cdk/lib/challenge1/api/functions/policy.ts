const policy = (sid: string, effect: string, methodArn: string, context: { [key: string]: string } = {}) => {
  return {
    principalId: '*',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: sid,
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: methodArn,
        },
      ],
    },
    context: context,
  };
};

export const allowPolicy = (methodArn: string, context: any) => {
  return policy('AllowAll', 'Allow', methodArn, context);
};
export const denyPolicy = (methodArn: string, message: string) => {
  return policy('DenyAll: ' + message, 'Deny', methodArn);
};
