import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import env from './env.json';

Amplify.configure({
  aws_project_region: 'ap-northeast-1',
  aws_cognito_region: 'ap-northeast-1',
  aws_user_pools_id: env.Challenge4UserPoolId,
  aws_user_pools_web_client_id: env.Challenge4UserPoolClientId,
  authenticationFlowType: 'USER_PASSWORD_AUTH',
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
