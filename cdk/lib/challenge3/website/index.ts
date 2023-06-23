import { OriginAccessIdentity, IOriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import { StaticHostBucket } from './staticBucket';
import { WebSiteDistribution } from './distribution';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { AssetsBucket } from './assetsBucket';

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
  private staticWebS3Bucket: StaticHostBucket;
  private assetsS3Bucket: AssetsBucket;
  private originAccessIdentity: OriginAccessIdentity;
  constructor(construct: Construct, id: string, uniqueId: string) {
    this.construct = construct;
    this.originAccessIdentity = this.createOrigin(id);
    this.staticWebS3Bucket = this.createStaticWebS3Bucket(id, uniqueId);
    this.cloudFront = this.createCloudFront(id, this.staticWebS3Bucket, this.originAccessIdentity);
    this.assetsS3Bucket = this.createAssetsS3Bucket(id, uniqueId);
  }
  get CloudFront() {
    return this.cloudFront;
  }
  get StaticWebS3Bucket() {
    return this.staticWebS3Bucket;
  }
  get AssetsS3Bucket() {
    return this.assetsS3Bucket;
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
  private createStaticWebS3Bucket(id: string, uniqueId: string) {
    return new StaticHostBucket(this.construct, `${id}-${uniqueId}-web`, {
      s3CanonicalUserId: this.S3CanonicalUserId,
    });
  }
  private createAssetsS3Bucket(id: string, uniqueId: string) {
    return new AssetsBucket(this.construct, `${id}-${uniqueId}-assets`, {
      origin: this.cloudFront.distributionDomainName,
    });
  }
  private createOrigin(id: string) {
    return new OriginAccessIdentity(this.construct, id, {
      comment: `${id} OriginAccessIdentity for S3 Bucket`,
    });
  }
}
