import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator, Grid, Card, Button, Heading, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import env from './env.json';

Amplify.configure({
  aws_project_region: 'ap-northeast-1',
  aws_cognito_region: 'ap-northeast-1',
  aws_user_pools_id: env.Challenge2UserPoolId,
  aws_user_pools_web_client_id: env.Challenge2UserPoolClientId,
  authenticationFlowType: 'USER_PASSWORD_AUTH',
});

async function getMessage() {
  try {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const response = await fetch(`${env.Challenge2APIGatewayURL}/api/flag`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    const { message } = await response.json();

    return `${message}`;
  } catch (error) {
    return 'Hello World!';
  }
}

function AuthenticatedPage() {
  const [message, setMessage] = React.useState('Hello World');
  React.useEffect(() => {
    (async () => {
      setMessage(await getMessage());
    })();
  }, []);
  return (
    <div>
      <h1>{message}</h1>
      <Button
        variation="primary"
        onClick={() => {
          Auth.signOut();
        }}
      >
        Sign out
      </Button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Grid
        templateColumns="2fr 3fr 2fr"
        templateRows="1fr 2fr 1fr"
        height="100%"
      >
        <Card
          columnStart={2}
          rowStart={2}
        >
          <Authenticator
            hideSignUp={true}
            components={{
              SignIn: {
                Header() {
                  const { tokens } = useTheme();
                  return (
                    <Heading
                      padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                      level={3}
                    >
                      Challenge2 Sign in
                    </Heading>
                  );
                },
              },
            }}
          >
            <AuthenticatedPage />
          </Authenticator>
        </Card>
      </Grid>
    </div>
  );
}

export default App;
