import { OriginAccessIdentity, IOriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { StaticHostBucket } from './staticBucket';
import { WebSiteDistribution } from './distribution';
import { IBucket } from 'aws-cdk-lib/aws-s3';

/**
 * WebSite
 * @class
 *
 * このクラスは、静的サイトを構築するためのリソースを構築します。
 * CDNとしてCloudFront、静的ファイルのホスティングにS3を使用します。
 * また、S3へのアクセスを制限するために、OriginAccessIdentityを使用します。
 */
export class WebSite {
  private construct: Construct;
  private cloudFront: WebSiteDistribution;
  private s3Bucket: StaticHostBucket;
  private originAccessIdentity: OriginAccessIdentity;
  constructor(construct: Construct, id: string, uniqueId: string) {
    this.construct = construct;
    this.originAccessIdentity = this.createOrigin(id);
    this.s3Bucket = this.createS3Bucket(id, uniqueId);
    this.cloudFront = this.createCloudFront(id, this.s3Bucket, this.originAccessIdentity);
  }
  get CloudFront() {
    return this.cloudFront;
  }
  get S3Bucket() {
    return this.s3Bucket;
  }
  get OriginAccessIdentity() {
    return this.originAccessIdentity;
  }

  get S3CanonicalUserId() {
    return this.OriginAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId;
  }

  private createCloudFront(id: string, bucket: IBucket, originAccessIdentity: IOriginAccessIdentity) {
    return new WebSiteDistribution(this.construct, id, {
      bucket,
      originAccessIdentity,
    });
  }
  private createS3Bucket(id: string, uniqueId: string) {
    return new StaticHostBucket(this.construct, `${id}-${uniqueId}`, {
      s3CanonicalUserId: this.S3CanonicalUserId,
    });
  }
  private createOrigin(id: string) {
    return new OriginAccessIdentity(this.construct, id, {
      comment: `${id} OriginAccessIdentity for S3 Bucket`,
    });
  }
}
