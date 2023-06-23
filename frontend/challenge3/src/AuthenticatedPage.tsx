import React from 'react';
import { Auth } from 'aws-amplify';
import { Button, Heading, Table, TableHead, TableBody, TableRow, TableCell } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import env from './env.json';

const apiGwURL = env.Challenge3APIGatewayURL;

async function getFiles(nextToken: string = '') {
  try {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const response = await fetch(`${apiGwURL}api/file${nextToken !== '' ? `?nextToken=${encodeURIComponent(nextToken)}` : ''}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    const { files, next }: { files: string[]; next: string } = await response.json();
    return { files, next };
  } catch (error) {
    alert(error);
    return { files: [], next: '' };
  }
}

async function getFileUrl(fileName: string) {
  try {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const response = await fetch(`${apiGwURL}api/file/${encodeURIComponent(fileName)}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status !== 200) {
      throw new Error('Failed to get file url');
    }
    const { url }: { url: string } = await response.json();
    return url;
  } catch (error) {
    alert(error);
    return 'Error';
  }
}

async function getFileUploadUrl(file: File) {
  try {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const response = await fetch(`${apiGwURL}api/file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        fileId: file.name,
        size: file.size,
      }),
    });
    if (response.status !== 200) {
      throw new Error('Failed to get upload url');
    }
    const { url }: { url: string } = await response.json();
    return url;
  } catch (error) {
    alert(error);
    return 'Error';
  }
}

async function uploadFile(url: string, file: File) {
  // urlに対してfileをPUTする
  // putの際はExpect: 100-continueでリクエストを送る

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Expect: '100-continue',
        'Content-Type': file.type,
      },
      body: file,
    });
    if (response.status !== 200) {
      throw new Error('Failed to upload file');
    }
    return true;
  } catch (error) {
    alert(error);
    return false;
  }
}

export default function AuthenticatedPage() {
  const [fileList, setFileList] = React.useState(['']);
  const [nextToken, setNextToken] = React.useState('');
  const [isUpload, setUploadCondition] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [tableBody, setTableBody] = React.useState(
    <TableBody>
      <TableCell colSpan={2}>No files</TableCell>
    </TableBody>,
  );

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileItem = event.target.files?.item(0);
    if (fileItem === undefined) {
      alert('Please select file');
      return;
    }
    setFile(fileItem);
  };

  React.useEffect(() => {
    (async () => {
      const { files, next } = await getFiles();
      setFileList(files);
      setNextToken(next);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const body = fileList.map((fileName) => {
        return (
          <TableRow>
            <TableCell>{fileName.split('/')[1]}</TableCell>
            <TableCell>
              <Button
                variation="primary"
                onClick={async () => {
                  const url = await getFileUrl(fileName);
                  if (url === 'Error') {
                    alert('Failed to get file url');
                    return;
                  }
                  window.open(url, '_blank');
                }}
              >
                Download
              </Button>
            </TableCell>
          </TableRow>
        );
      });
      setTableBody(<TableBody>{body}</TableBody>);
    })();
  }, [fileList]);
  return (
    <div>
      <Heading
        level={3}
        textAlign={'left'}
        marginBottom={30}
      >
        File Box 1
      </Heading>
      <input
        type="file"
        hidden={true}
        onChange={onChangeFile}
      />
      <Button
        width={'100%'}
        marginBottom={10}
        onClick={() => {
          (document.querySelector('input[type="file"]') as HTMLInputElement).click();
        }}
      >
        Select File
      </Button>
      <Button
        isLoading={isUpload}
        isDisabled={file ? false : true}
        width={'100%'}
        loadingText="Loading..."
        onClick={async () => {
          const file = (document.querySelector('input[type="file"]') as HTMLInputElement).files?.item(0);
          setUploadCondition(true);
          if (file === undefined || file === null) {
            alert('Please select file');
            return;
          }
          const url = await getFileUploadUrl(file);
          if (url === 'Error') {
            alert('Failed to get upload url');
            setUploadCondition(false);
            return;
          }

          if (await uploadFile(url, file)) {
            const { files, next } = await getFiles();
            setFile(null);
            setFileList(files);
            setNextToken(next);
          } else {
            alert('Upload Not Success');
          }
          setUploadCondition(false);
        }}
        variation="primary"
      >
        {file ? file.name : ''} Upload
      </Button>
      <Table
        caption=""
        highlightOnHover={false}
        textAlign={'left'}
        marginTop={30}
        marginBottom={20}
      >
        <TableHead>
          <TableRow>
            <TableCell as="th">File Name</TableCell>
            <TableCell as="th">Link</TableCell>
          </TableRow>
        </TableHead>
        {tableBody}
      </Table>

      {nextToken !== '' ? (
        <Button
          variation="primary"
          textAlign={'right'}
          onClick={async () => {
            const { files, next } = await getFiles(nextToken);
            setFileList([...fileList, ...files]);
            setNextToken(next);
          }}
        >
          Next
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
