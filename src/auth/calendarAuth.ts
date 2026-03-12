/* const ********************************************************************************/
import fs from 'fs'
import googleAuth, { type Credentials } from 'google-auth-library'
import readline from 'readline'

// If modifying these scopes, delete your previously saved credentials
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
const TOKEN_DIR = './_script/auth'
// const TOKEN_PATH = './access_token.json';
// const SECRET_PATH = './client_secret.json';

import TOKEN_PATH from './access_token.json'
import SECRET_PATH from './client_secret.json'

/* MODULE ********************************************************************************/

export function authorize() {
  const oauth2Client = setup()
  oauth2Client.credentials = TOKEN_PATH
  return oauth2Client
}

export function getNewToken() {
  const oauth2Client = setup()
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url: ', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close()
    oauth2Client
      .getToken(code)
      .then((tokenData) => {
        oauth2Client.credentials = tokenData.tokens
        if (tokenData.tokens.access_token) {
          storeToken(tokenData.tokens)
        }
      })
      .catch((err) => {
        console.log('Error while trying to retrieve access token', err)
        return
      })
  })
}

/* FUNC ********************************************************************************/

function setup() {
  const credentials = SECRET_PATH
  const clientSecret = credentials.installed.client_secret
  const clientId = credentials.installed.client_id
  const redirectUrl = credentials.installed.redirect_uris[0]
  return new googleAuth.OAuth2Client(clientId, clientSecret, redirectUrl)
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token: Credentials) {
  try {
    fs.mkdirSync(TOKEN_DIR)
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code != 'EEXIST'
    ) {
      throw err
    }
  }
  fs.writeFile(
    TOKEN_DIR + '/access_token.json',
    JSON.stringify(token),
    () => {},
  )
  console.log('Token stored to ' + TOKEN_DIR)
}
