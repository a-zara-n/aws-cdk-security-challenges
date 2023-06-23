import { Resource, IResource } from 'aws-cdk-lib/aws-apigateway';
import { LambdaFunction } from '../../integration/lambda';
import { Construct } from 'constructs';
import * as path from 'path';
import { BaseRoutes } from './base';
export class IndexRoutes extends BaseRoutes {
  constructor(scope: Construct, id: string, resource: Resource | IResource, origin: string) {
    super(scope, id, resource, origin);
  }
  override get GET() {
    const env = {
      ORIGIN_DOMAIN: this.origin,
    };
    const integration = new LambdaFunction(this.resource, 'Index', path.join(__dirname, 'functions', 'index.ts'), env).Integration;
    return this.resource.addMethod('GET', integration, {
      apiKeyRequired: false,
      methodResponses: [
        {
          statusCode: '200',
        },
      ],
    });
  }
}
