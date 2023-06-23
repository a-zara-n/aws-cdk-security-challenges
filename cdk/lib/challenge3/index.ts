import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IdPool } from './idp/userPool';
import { WebSite } from './website';
import { CHALLENGE_NAME } from './const';
import { RestApiGateway } from './api';

/**
 * ApplicationStack
 * @class
 * @extends Stack
 *
 * このStackは、Challenge3のためのリソースを構築します。
 * 主にこのスタックで構築されるリソースは以下の通りです。
 * - Amazon S3 Bucket
 * - Amazon Cognito User Pool
 * - Amazon CloudFront
 * - Amazon API Gateway
 * - AWS Lambda
 */
export class ApplicationStack extends Stack {
  readonly WebSite: WebSite;
  readonly IdPool: IdPool;
  readonly API: RestApiGateway;
  readonly id: string = CHALLENGE_NAME;
  constructor(scope: Construct, uniqueId: string, props?: StackProps) {
    super(scope, `${CHALLENGE_NAME}ApplicationStack`, props);
    this.WebSite = new WebSite(this, this.id, uniqueId);
    this.IdPool = new IdPool(this, this.id, {
      redirectDomain: this.WebSite.CloudFront.distributionDomainName,
    });
    this.API = new RestApiGateway(this, this.id, {
      origin: `https://${this.WebSite.CloudFront.distributionDomainName}`,
      userPoolId: this.IdPool.userPoolId,
      userPoolClientId: this.IdPool.client.userPoolClientId,
      assetsBucket: this.WebSite.AssetsS3Bucket,
    });
    this.output();
  }

  output() {
    new CfnOutput(this, `${CHALLENGE_NAME}WebSiteURL`, {
      value: `https://${this.WebSite.CloudFront.distributionDomainName}`,
      exportName: `${CHALLENGE_NAME}WebSiteURL`,
    });
    new CfnOutput(this, `${CHALLENGE_NAME}WebSiteOrigin`, {
      value: this.WebSite.CloudFront.distributionDomainName,
      exportName: `${CHALLENGE_NAME}WebSiteOrigin`,
    });
    new CfnOutput(this, `${CHALLENGE_NAME}WebSiteBucketName`, {
      value: this.WebSite.StaticWebS3Bucket.bucketName,
      exportName: `${CHALLENGE_NAME}WebSiteBucketName`,
    });
    new CfnOutput(this, `${CHALLENGE_NAME}AssetsBucketName`, {
      value: this.WebSite.AssetsS3Bucket.bucketName,
      exportName: `${CHALLENGE_NAME}AssetsBucketName`,
    });
    new CfnOutput(this, `${CHALLENGE_NAME}UserPoolId`, {
      value: this.IdPool.userPoolId,
      exportName: `${CHALLENGE_NAME}UserPoolId`,
    });
    new CfnOutput(this, `${CHALLENGE_NAME}UserPoolClientId`, {
      value: this.IdPool.client.userPoolClientId,
      exportName: `${CHALLENGE_NAME}UserPoolClientId`,
    });
    new CfnOutput(this, `${CHALLENGE_NAME}APIGatewayURL`, {
      value: this.API.url,
      exportName: `${CHALLENGE_NAME}APIGatewayURL`,
    });
  }
}
