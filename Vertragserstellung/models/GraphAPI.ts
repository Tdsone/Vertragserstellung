import { Context } from '@azure/functions';
import Axios from 'axios';

export default class GraphAPI {
  authToken: string;
  siteID: string;
  graphBaseURL: string;
  apiVersion: string;
  context: Context;

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
    apiVersion,
    context
  }) {
    if (graphBaseURL == '') {
      return new Error('Could not initialize; graphBaseURL is missing');
    }
    this.setGraphBaseURL(graphBaseURL);
    await this.authenticate(adal, graphBaseURL, clientID, clientSecret, tenant);
    this.setSiteID(siteID);
    this.setApiVersion(apiVersion);
    this.setContext(context);
  }

  async getMultipleSPListItems(listID: string, filter = '') {
    this.context.log('executing getMultipleSPListItems()');
    const filterQuery = filter ? `&filter=${filter}` : '';

    const URL = `${this.graphBaseURL}/${this.apiVersion}/sites/${this.siteID}/lists/${listID}/items?$top=1000&expand=fields${filterQuery}`;
    const config = {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    };

    try {
      const response = await Axios.get(URL, config);

      this.context.log('executed request');

      if (response.statusText !== 'OK') {
        this.context.log(response.config);
        this.context.res = {
          status: 500,
          body: `An error occurred fetching ${URL}. Contract was not created.`
        };
        this.context.done(); // if a request fails the function gets terminated
      }
      return response.data.value.map((item) => item.fields);
    } catch (err) {
      this.context.log(err);
      this.context.res = {
        status: 500,
        body: `An error occurred fetching ${URL}. Contract was not created.`
      };
      this.context.done(); // if a request fails the function gets terminated
    }
  }

  async getSingleSPListItemFields(listID: string, itemID: string) {
    const URL = `${this.graphBaseURL}/${this.apiVersion}/sites/${this.siteID}/lists/${listID}/items/${itemID}?expand=fields`;
    const config = {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    };

    const response = await Axios.get(URL, config);
    return response.data.fields;
  }

  async createNewListItem(data: object, listID: string) {
    const URL = `${this.graphBaseURL}/${this.apiVersion}/sites/${this.siteID}/lists/${listID}/items`;

    const config = {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    };

    try {
      const res = await Axios.post(URL, data, config);
      return {
        info: res.data,
        err: null
      };
    } catch (err) {
      console.error("Couldn't save item to list.");
      console.error(err);
      return {
        info: null,
        err
      };
    }
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

  setContext(context: Context) {
    this.context = context;
  }
}
