import { IRoutes } from './interface';
import { Construct } from 'constructs';
import { Resource, IResource, Method } from 'aws-cdk-lib/aws-apigateway';

export class BaseRoutes implements IRoutes {
  readonly resource: Resource | IResource;
  readonly origin: string;
  readonly scope: Construct;
  constructor(scope: Construct, id: string, resource: Resource | IResource, origin: string) {
    this.scope = scope;
    this.origin = origin;
    this.resource = resource;
  }

  get GET(): Method | undefined {
    return undefined;
  }
  get POST(): Method | undefined {
    return undefined;
  }
  get PUT(): Method | undefined {
    return undefined;
  }
  get DELETE(): Method | undefined {
    return undefined;
  }
  get PATCH(): Method | undefined {
    return undefined;
  }
}
