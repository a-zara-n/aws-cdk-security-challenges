import { Callback, Context, PostConfirmationTriggerEvent, PostConfirmationTriggerHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand, AdminUpdateUserAttributesCommandInput } from '@aws-sdk/client-cognito-identity-provider';

const cognito = new CognitoIdentityProviderClient({ region: 'ap-northeast-1' });

/**
 * PostConfirmationTrigger
 * @param {PostConfirmationTriggerEvent} event
 * @param {Context} context
 * @param {Callback<any>} callback
 *
 * この関数は、CognitoのPostConfirmationTriggerに紐づけられています。
 * この関数は、ユーザーがサインアップした後に実行されます。
 * 関数内では、ユーザーの属性にRoleを追加します。
 */
export const handler: PostConfirmationTriggerHandler = (event: PostConfirmationTriggerEvent, context: Context, callback: Callback<any>) => {
  console.log(event);
  const updateUserAttributesCommandParam: AdminUpdateUserAttributesCommandInput = {
    UserPoolId: event.userPoolId,
    Username: event.userName,
    UserAttributes: [
      {
        Name: 'custom:role',
        Value: 'user',
      },
    ],
  };
  const updateUserAttributesCommand = new AdminUpdateUserAttributesCommand(updateUserAttributesCommandParam);
  cognito.send(updateUserAttributesCommand).then((res) => {});
  callback(null, event);
};
