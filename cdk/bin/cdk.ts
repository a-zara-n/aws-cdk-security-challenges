#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApplicationStack as Challenge1ApplicationStack } from '../lib/challenge1/';
import { ApplicationStack as Challenge2ApplicationStack } from '../lib/challenge2';
import { ApplicationStack as Challenge3ApplicationStack } from '../lib/challenge3';
import { ApplicationStack as Challenge4ApplicationStack } from '../lib/challenge4';
import { DeploymentStack as Challenge1DeploymentStack } from '../lib/challenge1/deployment';
import { DeploymentStack as Challenge2DeploymentStack } from '../lib/challenge2/deployment';
import { DeploymentStack as Challenge3DeploymentStack } from '../lib/challenge3/deployment';
import { DeploymentStack as Challenge4DeploymentStack } from '../lib/challenge4/deployment';
const app = new cdk.App();

/**
 * Unique Id
 * @description
 * uniqueIdは、S3等のグローバルに一意な名前をつける必要があるリソースの名前に利用します。
 * @todo
 * 環境変数から取得するように変更
 */
const uniqueId = 'DummyIdDummyId';
const env = {
  region: process.env.CDK_DEFAULT_REGION,
};

// Challenge1ApplicationStack
const challenge1 = new Challenge1ApplicationStack(app, uniqueId, { env });

// Challenge1DeploymentStack
const challenge1Deployment = new Challenge1DeploymentStack(app, { env });
challenge1Deployment.addDependency(challenge1);

// Challenge2ApplicationStack
const challenge2 = new Challenge2ApplicationStack(app, uniqueId, { env });

// Challenge2DeploymentStack
const challenge2Deployment = new Challenge2DeploymentStack(app, { env });
challenge2Deployment.addDependency(challenge2);

// Challenge3ApplicationStack
const challenge3 = new Challenge3ApplicationStack(app, uniqueId, { env });

// Challenge3DeploymentStack
const challenge3Deployment = new Challenge3DeploymentStack(app, { env });
challenge3Deployment.addDependency(challenge3);

// Challenge4ApplicationStack
const challenge4 = new Challenge4ApplicationStack(app, uniqueId, { env });

// Challenge4DeploymentStack
const challenge4Deployment = new Challenge4DeploymentStack(app, { env });
challenge4Deployment.addDependency(challenge4);
