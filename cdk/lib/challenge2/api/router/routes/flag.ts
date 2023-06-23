import { Resource, IResource, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { LambdaFunction } from '../../integration/lambda';
import { Construct } from 'constructs';
import { BaseRoutes } from './base';
import * as path from 'path';
import * as fs from 'fs';

export class FlagRoutes extends BaseRoutes {
  private authorizer: TokenAuthorizer;

  constructor(scope: Construct, id: string, resource: Resource | IResource, origin: string, authorizer: TokenAuthorizer) {
    super(scope, id, resource, origin);
    this.authorizer = authorizer;
  }
  override get GET() {
    const flag = fs.readFileSync(path.join(__dirname, 'assets', 'flag'), 'utf-8');
    const env = {
      ORIGIN_DOMAIN: this.origin,
      FLAG: flag ?? 'CDK{this_is_a_fake_flag}',
    };
    const integration = new LambdaFunction(this.resource, 'Index', path.join(__dirname, 'functions', 'flag.ts'), env).Integration;
    return this.resource.addMethod('GET', integration, {
      apiKeyRequired: false,
      methodResponses: [
        {
          statusCode: '200',
        },
      ],
      authorizer: this.authorizer,
    });
  }
}
