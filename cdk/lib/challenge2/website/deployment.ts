import { Construct } from 'constructs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { CHALLENGE_NAME } from '../const';

export class WebSiteDeployment extends BucketDeployment {
  constructor(scope: Construct, id: string, destinationBucket: IBucket) {
    const assetsPath = path.join('/app', 'frontend', CHALLENGE_NAME.toLowerCase(), 'build');
    console.log(assetsPath);
    super(scope, `${id}WebSiteDeployment`, {
      destinationBucket,
      sources: [
        Source.data('error.html', '<html><body><h1>Error</h1></body></html'),
        Source.data('notfound.html', '<html><body><h1>Not Found</h1></body></html'),
        Source.asset(assetsPath),
      ],
    });
  }
}
