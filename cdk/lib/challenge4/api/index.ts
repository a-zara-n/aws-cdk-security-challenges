import { RestApi, RestApiProps, Cors, MethodLoggingLevel, EndpointType, TokenAuthorizer, IdentitySource } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { aws_lambda_nodejs as lambdaNodejs, Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { APIRoutes } from './router';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export interface ApiGatewayProps extends RestApiProps {
  origin: string;
  assetsBucket: Bucket;
  userPoolId: string;
  userPoolClientId: string;
}

export class RestApiGateway extends RestApi {
  private authorizer: TokenAuthorizer;
  private readonly routes: APIRoutes;
  private readonly origin: string;
  private readonly assetsBucket: Bucket;
  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, `${id}Gateway`, {
      ...props,
      restApiName: `${id}Gateway`,
      defaultMethodOptions: {},
      minimumCompressionSize: 1024,
      endpointTypes: [EndpointType.REGIONAL],
      policy: undefined,
      deploy: true,
      cloudWatchRole: false,
      endpointExportName: undefined,
      failOnWarnings: false,
      parameters: undefined,
      deployOptions: {
        stageName: 'v1',
        tracingEnabled: true,
        loggingLevel: MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
        cacheClusterEnabled: true,
        cacheClusterSize: '0.5',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: [props.origin],
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        statusCode: 200,
      },
    });
    this.origin = props.origin;
    this.assetsBucket = props.assetsBucket;
    this.authorizer = this.createAuthorizer(scope, id, props.userPoolId, props.userPoolClientId);
    this.routes = this.createAPIEndpoints();
  }

  get Authorizer() {
    return this.authorizer;
  }

  get Routes() {
    return this.routes;
  }

  private createAPIEndpoints() {
    return new APIRoutes(this, 'APIRoutes', this.root, {
      authorizer: this.authorizer,
      originDomain: this.origin || '',
      assetsBucket: this.assetsBucket,
    });
  }

  private createAuthorizer(scope: Construct, id: string, userPoolId: string, userPoolClientId: string) {
    const entry = path.join(__dirname, 'functions', 'authorizer.ts');
    const authorizer = new lambdaNodejs.NodejsFunction(scope, `${id}AuthorizerFunction`, {
      runtime: Runtime.NODEJS_18_X,
      entry: entry,
      handler: 'handler',
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'es2018',
      },
      timeout: Duration.seconds(3),
    });
    authorizer.addEnvironment('COGNITO_USER_POOL_ID', userPoolId);
    authorizer.addEnvironment('COGNITO_USER_POOL_CLIENT_ID', userPoolClientId);
    return new TokenAuthorizer(scope, `${id}Authorizer`, {
      handler: authorizer,
      resultsCacheTtl: Duration.minutes(0),
      identitySource: IdentitySource.header('Authorization'),
      authorizerName: `${id}Authorizer`,
    });
  }
}
