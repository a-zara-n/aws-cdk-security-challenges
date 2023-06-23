import { RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BucketProps, BucketEncryption, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';
import * as fs from 'fs';

export interface AssetsBucketProps extends BucketProps {
  origin: string;
}

/**
 * AssetsBucket
 * @class
 * @extends Bucket
 *
 * このクラスは、アップロードされたファイルを保存するためのS3バケットを構築します。
 */
export class AssetsBucket extends Bucket {
  constructor(scope: Construct, id: string, props: AssetsBucketProps) {
    super(scope, id, {
      ...props,
      bucketName: `${id.toLowerCase()}-assets-bucket`,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [],
      cors: [
        {
          allowedMethods: [HttpMethods.GET, HttpMethods.HEAD, HttpMethods.PUT],
          allowedOrigins: [`https://${props.origin}`],
          allowedHeaders: ['*'],
        },
      ],
      publicReadAccess: false,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: false,
        ignorePublicAcls: true,
        restrictPublicBuckets: false,
      },
    });
    if (!props) return;
    this.defaultAssetsDeploy(scope);
  }

  private defaultAssetsDeploy(scope: Construct) {
    const flag = fs.readFileSync(path.join(__dirname, 'assets', 'flag'), 'utf-8');
    const sources = [Source.data('flag.txt', flag)];
    new BucketDeployment(scope, 'AssetsBucketDeployment', {
      destinationBucket: this,
      sources: sources,
    });
  }
}
