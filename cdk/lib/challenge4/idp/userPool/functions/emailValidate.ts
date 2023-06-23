import { PreSignUpEmailTriggerEvent } from 'aws-lambda';
import { invalidEmailDomains } from './const';
/**
 * PreSignUpEmailTrigger
 * @param {PreSignUpEmailTriggerEvent} event
 * @returns {PreSignUpEmailTriggerEvent}
 *
 * この関数は、CognitoのPreSignUpEmailTriggerに紐づけられています。
 * この関数は、ユーザーがサインアップする際に実行されます。
 * 関数ないでは、EmailのAliasが含まれていないことや有名な各種捨てメアドのドメインでないことを確認し、EDoSにつながる可能性のあるユーザーのサインアップを防ぎます。
 */
export const handler = async (event: PreSignUpEmailTriggerEvent) => {
  const email = event.request.userAttributes.email;
  if (email === undefined) {
    throw new Error('Email is not defined');
  }
  const emailAlias = email.split('+')[1];
  if (emailAlias !== undefined) {
    throw new Error('Email Alias is not allowed');
  }
  const emailDomain = email.split('@')[1];
  if (invalidEmailDomains.includes(emailDomain)) {
    throw new Error('Email Domain is not allowed');
  }
  return event;
};
