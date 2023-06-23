import React from 'react';
import './App.css';
import { Auth } from 'aws-amplify';
import { Authenticator, Grid, Card, Button, Heading, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import AuthenticatedPage from './AuthenticatedPage';



function App() {
  const [isAuth, setAuth] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      try {
        await Auth.currentSession();
        setAuth(true);
      } catch (error) {
        setAuth(false);
      }
    })();
  }, []);
  return (
    <div className="App">
      {
        !isAuth ? (
          <Grid
            templateColumns="2fr 3fr 2fr"
            templateRows="1fr 2fr 1fr"
          >
            <Card
              columnStart={2}
              rowStart={2}
            >
              <Authenticator 
                components={{
                  SignIn: {
                    Header() {
                      const { tokens } = useTheme();
                      return (
                          <Heading
                              padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                              level={3}
                          >Challenge4 Sign in</Heading>
                      );
                    },
                  }
                }}
              >
                {
                  () => {
                    setAuth(true);
                    return (
                      <></>
                    );
                  }
                }
              </Authenticator>
            </Card>
          </Grid>
        ) : (
          <Grid
          templateColumns="1fr 3fr 1fr"
          templateRows="1fr 2fr 1fr"
        >
          <Card column={2}>
            <AuthenticatedPage />
          </Card>
          <Card>
            <Button variation="primary" onClick={async () => {
              await Auth.signOut();
              setAuth(false);
            }}>
              Sign out
            </Button>
          </Card>
        </Grid>
        )
      }
      </div>
    );
}

export default App;
