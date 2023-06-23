import { Construct } from 'constructs';
import { LambdaFunction } from '../integration/lambda';
import * as path from 'path';
import { Resource, IResource, TokenAuthorizer, Method } from 'aws-cdk-lib/aws-apigateway';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as fs from 'fs';
import { IndexRoutes } from './routes';

import { IRoutes } from './routes/interface';
import { FileRoutes } from './routes/file';
import { FileIdRoutes } from './routes/fileId';

export interface RoutesProps {
  authorizer: TokenAuthorizer;
  originDomain: string;
  assetsBucket: Bucket;
}

export class APIRoutes {
  readonly resource: Resource | IResource;
  readonly authorizer: TokenAuthorizer;
  readonly originDomain: string;
  readonly scope: Construct;
  readonly id: string;
  readonly assetsBucket: Bucket;
  private readonly routes: { [key: string]: { [key: string]: Method } };
  constructor(scope: Construct, id: string, resource: Resource | IResource, props: RoutesProps) {
    this.id = id;
    this.scope = scope;
    this.originDomain = props.originDomain;
    this.resource = resource;
    this.authorizer = props.authorizer;
    this.assetsBucket = props.assetsBucket;
    this.routes = this.createAPIEndpoints();
  }
  get Routes() {
    return this.routes;
  }
  private createAPIEndpoints(): { [key: string]: { [key: string]: Method } } {
    const fileResource = this.resource.addResource('api').addResource('file');
    const fileIdResource = fileResource.addResource('{fileId}');

    const indexRoutes = new IndexRoutes(this.scope, this.id, this.resource, this.originDomain);
    const fileRoutes = new FileRoutes(this.scope, this.id, fileResource, this.originDomain, this.authorizer, this.assetsBucket);
    const fileIdRoutes = new FileIdRoutes(this.scope, this.id, fileIdResource, this.originDomain, this.authorizer, this.assetsBucket);

    const indexMethod = {
      GET: indexRoutes.GET,
    };

    const fileMethod = {
      GET: fileRoutes.GET,
      POST: fileRoutes.POST,
    };

    const fileIdMethod = {
      GET: fileIdRoutes.GET,
    };

    return {
      '/': indexMethod,
      '/api/file': fileMethod,
      '/api/file/{fileId}': fileIdMethod,
    };
  }
}
