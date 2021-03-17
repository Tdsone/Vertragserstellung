export default class GraphAPI{

    authToken : string;
    graphBaseURL : string; 
    apiVersion : string; 

    constructor(){
        this.authToken = ""
        this.graphBaseURL = ""
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

    async initialize(adal, graphBaseURL = "", clientID : string, clientSecret : string, tenant : string){
        if(graphBaseURL == ""){
            return new Error("Could not initialize; graphBaseURL is missing")
        }
        this.setGraphBaseURL(graphBaseURL)
        await this.authenticate(adal, graphBaseURL, clientID, clientSecret, tenant)
    }

    async getSPListItem(){

    }

    setAuthToken(token){
        this.authToken = token
    }

    setGraphBaseURL(graphBaseURL: string){
        this.graphBaseURL = graphBaseURL
    }

}