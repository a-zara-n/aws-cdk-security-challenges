import { Construct } from 'constructs';
import { Grant } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { aws_lambda_nodejs as lambdaNodejs, Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export class LambdaFunction {
  private function: NodejsFunction;
  constructor(scope: Construct, id: string, entry: string, environ?: { [key: string]: string }) {
    const lambdaFunctionEnviron = environ ? environ : {};
    this.function = new lambdaNodejs.NodejsFunction(scope, id, {
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
    Object.keys(lambdaFunctionEnviron).forEach((key) => {
      this.function.addEnvironment(key, lambdaFunctionEnviron[key]);
    });
  }

  get Integration(): LambdaIntegration {
    return new LambdaIntegration(this.function);
  }
}
