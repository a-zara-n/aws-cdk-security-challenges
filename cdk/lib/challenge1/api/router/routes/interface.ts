import { Method } from 'aws-cdk-lib/aws-apigateway';

export interface IRoutes {
  GET?: Method;
  POST?: Method;
  PUT?: Method;
  DELETE?: Method;
  PATCH?: Method;
  HEAD?: Method;
}
