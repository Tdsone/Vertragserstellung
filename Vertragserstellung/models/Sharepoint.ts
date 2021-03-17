export default class Sharepoint{

    authToken : string;
    graphBaseURL : string; 

    constructor(){

    }

    async authenticate(adal, graphBaseURL : string, clientID : string, clientSecret : string, tenant : string){
        const authToken = await new Promise((resolve, reject) => {
            const authContext = new adal.AuthenticationContext(
                `https://login.microsoftonline.com/${tenant}`
            )
            authContext.acquireTokenWithClientCredentials(
                graphBaseURL,
                clientID,
                clientSecret,
                (err, tokenRes) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(tokenRes.accessToken)
                }
            )
        })
        this.setAuthToken(authToken)
    }

    async getSPListItem(){

    }

    setAuthToken(token){
        this.authToken = token
    }

}