import { Stack, StackProps, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CHALLENGE_NAME } from './const';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { WebSiteDeployment } from './website/deployment';

/**
 * DeploymentStack
 * @class
 * @extends Stack
 *
 * このStackは、Challenge3のためのフロントエンドのデプロイを行います。
 * 主にこのスタックで構築されるリソースは以下の通りです。
 * - Amazon S3 Bucket
 */
export class DeploymentStack extends Stack {
  constructor(scope: Construct, props?: StackProps) {
    super(scope, `${CHALLENGE_NAME}DeploymentStack`, props);
    const staticBucketName = Fn.importValue(`${CHALLENGE_NAME}WebSiteBucketName`);
    const staticBucket = Bucket.fromBucketName(this, `${CHALLENGE_NAME}StaticBucket`, staticBucketName);
    new WebSiteDeployment(this, `${CHALLENGE_NAME}WebSiteDeployment`, staticBucket);
  }
}
