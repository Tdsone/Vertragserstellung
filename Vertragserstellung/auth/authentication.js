const adal = require('adal-node')

import { CLIENT_ID, CLIENT_SECRET, TENANT } from './auth-config'
import { GRAPH_BASE_URL } from '../constants'

function getToken() {
    return new Promise((resolve, reject) => {
        const authContext = new adal.AuthenticationContext(
            `https://login.microsoftonline.com/${TENANT}`
        )
        authContext.acquireTokenWithClientCredentials(
            GRAPH_BASE_URL,
            CLIENT_ID,
            CLIENT_SECRET,
            (err, tokenRes) => {
                if (err) {
                    reject(err)
                }
                resolve(tokenRes.accessToken)
            }
        )
    })
}

export { getToken }
