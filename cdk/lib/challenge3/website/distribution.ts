import { Construct } from 'constructs';
import { CfnOutput, Duration } from 'aws-cdk-lib';
import { Distribution, IOriginAccessIdentity, AllowedMethods, CachedMethods, CachePolicy, ViewerProtocolPolicy, FunctionAssociation } from 'aws-cdk-lib/aws-cloudfront';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { ARecord, AaaaRecord } from 'aws-cdk-lib/aws-route53';

interface BaseDistributionProps {
  originAccessIdentity: IOriginAccessIdentity;
  bucket: IBucket;
}

/**
 * WebSiteDistribution
 * @class
 * @extends Distribution
 *
 * このクラスは、CloudFrontのDistributionを構築します。
 */
export class WebSiteDistribution extends Distribution {
  constructor(scope: Construct, id: string, props: BaseDistributionProps) {
    const origin = new S3Origin(props.bucket, {
      originAccessIdentity: props.originAccessIdentity,
    });

    const errorResponses = [
      {
        ttl: Duration.seconds(300),
        httpStatus: 403,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      },
      {
        ttl: Duration.seconds(300),
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      },
    ];

    const defaultBehavior = {
      allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
      cachedMethods: CachedMethods.CACHE_GET_HEAD,
      cachePolicy: CachePolicy.CACHING_DISABLED,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      origin: origin,
    };

    const componetId = `${id.charAt(0).toUpperCase() + id.slice(1)}Distribution`;

    super(scope, componetId, {
      comment: `Distribution for S3 Bucket # ${componetId}`,
      defaultRootObject: 'index.html',
      errorResponses,
      defaultBehavior,
    });
  }
}
