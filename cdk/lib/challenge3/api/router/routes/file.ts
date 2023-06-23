import { Resource, IResource, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { LambdaFunction } from '../../integration/lambda';
import { Construct } from 'constructs';
import { BaseRoutes } from './base';
import * as path from 'path';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class FileRoutes extends BaseRoutes {
  private authorizer: TokenAuthorizer;
  private bucket: Bucket;

  constructor(scope: Construct, id: string, resource: Resource | IResource, origin: string, authorizer: TokenAuthorizer, bucket: Bucket) {
    super(scope, id, resource, origin);
    this.authorizer = authorizer;
    this.bucket = bucket;
  }

  private get lambdaEnvironParams() {
    return {
      ORIGIN_DOMAIN: this.origin,
      BUCKET_NAME: this.bucket.bucketName,
    };
  }

  override get GET() {
    const lambdaFunction = new LambdaFunction(this.resource, 'ListFile', path.join(__dirname, 'functions', 'listFile.ts'), this.lambdaEnvironParams);
    this.bucket.grantRead(lambdaFunction.Function);
    return this.resource.addMethod('GET', lambdaFunction.Integration, {
      apiKeyRequired: false,
      methodResponses: [
        {
          statusCode: '200',
        },
      ],
      authorizer: this.authorizer,
    });
  }

  override get POST() {
    const lambdaFunction = new LambdaFunction(this.resource, 'PostFile', path.join(__dirname, 'functions', 'postFile.ts'), this.lambdaEnvironParams);
    this.bucket.grantWrite(lambdaFunction.Function);
    return this.resource.addMethod('POST', lambdaFunction.Integration, {
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
