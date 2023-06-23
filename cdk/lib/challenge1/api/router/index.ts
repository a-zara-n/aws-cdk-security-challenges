import { Construct } from 'constructs';
import { LambdaFunction } from '../integration/lambda';
import * as path from 'path';
import { Resource, IResource, TokenAuthorizer, Method } from 'aws-cdk-lib/aws-apigateway';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as fs from 'fs';
import { IndexRoutes } from './routes';
import { FlagRoutes } from './routes/flag';
import { IRoutes } from './routes/interface';

export interface RoutesProps {
  authorizer: TokenAuthorizer;
  originDomain: string;
}

export class APIRoutes {
  readonly resource: Resource | IResource;
  readonly authorizer: TokenAuthorizer;
  readonly originDomain: string;
  readonly scope: Construct;
  readonly id: string;
  private readonly routes: { [key: string]: { [key: string]: Method } };
  constructor(scope: Construct, id: string, resource: Resource | IResource, props: RoutesProps) {
    this.id = id;
    this.scope = scope;
    this.originDomain = props.originDomain;
    this.resource = resource;
    this.authorizer = props.authorizer;
    this.routes = this.createAPIEndpoints();
  }
  get Routes() {
    return this.routes;
  }
  private createAPIEndpoints(): { [key: string]: { [key: string]: Method } } {
    const apiResource = this.resource.addResource('api');
    const flagResource = apiResource.addResource('flag');
    const indexRoutes = new IndexRoutes(this.scope, this.id, this.resource, this.originDomain);
    const flagRoutes = new FlagRoutes(this.scope, this.id, flagResource, this.originDomain, this.authorizer);
    const indexMethod = {
      GET: indexRoutes.GET,
    };
    const flagMethod = {
      GET: flagRoutes.GET,
    };
    return {
      '/': indexMethod,
      '/api/flag': flagMethod,
    };
  }
}
