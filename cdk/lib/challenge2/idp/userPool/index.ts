import { Construct } from 'constructs';
import { Fn, Duration, RemovalPolicy } from 'aws-cdk-lib';
import {
  UserPool,
  UserPoolProps,
  AccountRecovery,
  Mfa,
  VerificationEmailStyle,
  StringAttribute,
  UserPoolClient,
  UserPoolDomain,
  ClientAttributes,
  StandardAttributesMask,
  UserPoolOperation,
} from 'aws-cdk-lib/aws-cognito';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { aws_lambda_nodejs as lambdaNodejs } from 'aws-cdk-lib';
import * as path from 'path';

const EMAIL_SUBJECT = 'Verify your email for our Challenge1!';
const EMAIL_BODY = 'Thanks for signing up to our Challenge1! Your verification code is {####}';
const CUSTOM_ATTRIBUTES = {
  role: new StringAttribute({ mutable: true }),
};

export interface Challenge1UserPoolProps extends UserPoolProps {
  redirectDomain: string;
}

export class IdPool extends UserPool {
  private userPoolClient: UserPoolClient;
  private userPoolDomain: UserPoolDomain;
  constructor(scope: Construct, id: string, prorps: Challenge1UserPoolProps) {
    const PASSWORD_POLICY = {
      minLength: 8,
    };
    const SELFE_SIGN_UP_ENABLED = true;
    const props: UserPoolProps = {
      userPoolName: id,
      removalPolicy: RemovalPolicy.DESTROY,
      selfSignUpEnabled: SELFE_SIGN_UP_ENABLED,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: PASSWORD_POLICY,
      accountRecovery: AccountRecovery.NONE,
      mfa: Mfa.OFF,
      userVerification: {
        emailSubject: EMAIL_SUBJECT,
        emailBody: EMAIL_BODY,
        emailStyle: VerificationEmailStyle.CODE,
      },
      signInCaseSensitive: false,
      customAttributes: CUSTOM_ATTRIBUTES,
    };
    super(scope, `${id}UserPool`, props);
    const USER_READ_ATTRIBUTES = this.createClientAttributes(
      {
        email: true,
        emailVerified: true,
      },
      Object.keys(CUSTOM_ATTRIBUTES),
    );
    const USER_WRITE_ATTRIBUTES = this.createClientAttributes(
      {
        email: true,
      },
      Object.keys(CUSTOM_ATTRIBUTES),
    );
    this.userPoolClient = this.createClient(`${id}UserPoolClient`, USER_READ_ATTRIBUTES, USER_WRITE_ATTRIBUTES);
    this.userPoolDomain = this.createCustomDomain(id);

    this.addPreSignUpTrigger(id);
  }

  get client() {
    return this.userPoolClient;
  }

  get domain() {
    return this.userPoolDomain;
  }

  private createClient(id: string, readAttributes: ClientAttributes, writeAttributes: ClientAttributes) {
    return this.addClient(`${id}Client`, {
      userPoolClientName: `${id}Client`,
      preventUserExistenceErrors: true,
      enableTokenRevocation: true,
      refreshTokenValidity: Duration.days(30),
      accessTokenValidity: Duration.hours(1),
      authFlows: {
        userPassword: true,
        userSrp: false,
        adminUserPassword: false,
        custom: false,
      },
      readAttributes: readAttributes,
      writeAttributes: writeAttributes,
    });
  }

  private createClientAttributes(standardAttributes: StandardAttributesMask, customAttributes: string[]) {
    return new ClientAttributes().withStandardAttributes(standardAttributes).withCustomAttributes(...customAttributes);
  }

  private createCustomDomain(id: string) {
    return this.addDomain(`${id}Domain`, {
      cognitoDomain: {
        domainPrefix: id.toLowerCase(),
      },
    });
  }

  private addPreSignUpTrigger(id: string) {
    const trigger = this.createTriggerFunction(`${id}PreSignUpTrigger`, 'emailValidate.ts', 10);
    this.addTrigger(UserPoolOperation.PRE_SIGN_UP, trigger);
  }

  private createTriggerFunction(functionName: string, entry: string, timeout?: number) {
    return new lambdaNodejs.NodejsFunction(this, functionName, {
      entry: path.join(__dirname, 'functions', entry),
      handler: 'handler',
      timeout: Duration.seconds(timeout || 3),
      bundling: {
        minify: true,
        sourceMap: true,
        target: 'es2018',
      },
    });
  }
}
