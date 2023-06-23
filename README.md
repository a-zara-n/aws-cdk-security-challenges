# AWS CDK Security Challenges

## 概要 / Overview

本リポジトリは AWS を用いて実装したアプリケーションに置いて発生するセキュリティ上の課題を見つけ出すためのハンズオンです。

主に取り扱う内容としては下記の内容を想定しています。

1. Cognito User Pool における権限の昇格
2. Cognito User Pool における意図しない Self-signup
3. S3 における署名付き URL 生成時の不適切な Path の扱い
4. AWS のサービスの値を無制限に信用することによって発生するアプリケーション上の脆弱性

また、今後も課題を追加、更新していく予定です。

利用には、ご自身の AWS アカウントが必要となります。環境の展開には、Docker を用いた環境構築用のコンテナを用意していますので、そちらを利用してください。

## Challenge Mini Application

### Challenge 1

本チャレンジは、Cognito User Pool のアプリクライアントにおいて、アプリケーションの構成上意図しない属性の書き換えが可能な状態になっていることにより発生する、権限の昇格について確認をするものになります。

### Challenge 2

### Challenge 3

### Challenge 4

## 環境の構築 / Setup

### 認証情報 / Credentials

認証情報は、`/deploy/`の配下に`aws`ディレクトりを作成し、`credentials`ファイルを作成してください。

**既存の認証情報を利用する場合**

```sh
mkdir -p ./deploy/aws
cp /path/to/your/credentials ./aws/credentials
```

**推奨**

`.gitignore`を利用して、`credentials`ファイルを Git の管理対象から外しておりますが、誤って Git の管理対象に含まれてしまう可能性は存在します。そのため、[git-secrets](https://github.com/awslabs/git-secrets)などのツールを利用して、認証情報が Git の管理対象に含まれないようにしてください。

### AWS へのデプロイ / Deploy to AWS

```sh
make setup
```

## 開発環境 / Development

### 開発環境の準備

```sh
make init
```

## CDK Shell

```sh
make bash-cdk
```

## CDK Destroy

```sh
make destroy
```

## React app shell

```sh
make bash-react
```
