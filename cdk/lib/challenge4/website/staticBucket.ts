import { RemovalPolicy } from 'aws-cdk-lib';
import { CanonicalUserPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket, BucketProps, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface StaticHostBucketProps extends BucketProps {
  s3CanonicalUserId: string;
}

/**
 * StaticHostBucket
 * @class
 * @extends Bucket
 *
 * このクラスは、静的ファイルのホスティングに使用するS3バケットを構築します。
 */
export class StaticHostBucket extends Bucket {
  constructor(scope: Construct, id: string, props: StaticHostBucketProps) {
    super(scope, id, {
      ...props,
      bucketName: `${id.toLowerCase()}-static-host-bucket`,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [],
      publicReadAccess: false,
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: false,
        ignorePublicAcls: true,
        restrictPublicBuckets: false,
      },
    });
    if (!props) return;
    this.attachBucketPolicy(props.s3CanonicalUserId);
  }

  private attachBucketPolicy(s3CanonicalUserId: string) {
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:GetObject'],
      resources: [`${this.bucketArn}/*`],
      principals: [new CanonicalUserPrincipal(s3CanonicalUserId)],
    });
  }
}
