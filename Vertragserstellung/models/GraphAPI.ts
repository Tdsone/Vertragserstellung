import Axios from 'axios';

export default class GraphAPI {
  authToken: string;
  siteID: string;
  graphBaseURL: string;
  apiVersion: string;

  constructor() {
    this.authToken = '';
    this.siteID = '';
    this.graphBaseURL = '';
    this.apiVersion = '';
  }

  async authenticate(
    adal,
    graphBaseURL: string,
    clientID: string,
    clientSecret: string,
    tenant: string
  ) {
    const authToken = await new Promise((resolve, reject) => {
      const authContext = new adal.AuthenticationContext(
        `https://login.microsoftonline.com/${tenant}`
      );
      authContext.acquireTokenWithClientCredentials(
        graphBaseURL,
        clientID,
        clientSecret,
        (err, tokenRes) => {
          if (err) {
            reject(err);
          }
          resolve(tokenRes.accessToken);
        }
      );
    });
    this.setAuthToken(String(authToken));
  }

  // makes the API usable (does authentication)
  async initialize({
    adal,
    graphBaseURL = '',
    clientID,
    clientSecret,
    tenant,
    siteID,
    apiVersion
  }) {
    if (graphBaseURL == '') {
      return new Error('Could not initialize; graphBaseURL is missing');
    }
    this.setGraphBaseURL(graphBaseURL);
    await this.authenticate(adal, graphBaseURL, clientID, clientSecret, tenant);
    this.setSiteID(siteID);
    this.setApiVersion(apiVersion);
  }

  async getMultipleSPListItems(listID: string) {
    const response = await Axios.get(
      `${this.graphBaseURL}/${this.apiVersion}/sites/${this.siteID}/lists/${listID}/items?$top=1000&expand=fields`,
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }
    );
    return response.data.value.map((item) => item.fields);
  }

  async getSingleSPListItemFields(listID: string, itemID: string) {
    const response = await Axios.get(
      `${this.graphBaseURL}/${this.apiVersion}/sites/${this.siteID}/lists/${listID}/items/${itemID}?expand=fields`,
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      }
    );
    return response.data.value.fields;
  }

  // setter

  setAuthToken(token: string) {
    this.authToken = token;
  }

  setGraphBaseURL(graphBaseURL: string) {
    this.graphBaseURL = graphBaseURL;
  }

  setSiteID(siteID: string) {
    this.siteID = siteID;
  }

  setApiVersion(apiVersion: string) {
    this.apiVersion = apiVersion;
  }
}
