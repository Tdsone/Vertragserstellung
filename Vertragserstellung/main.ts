// external modules/packages
const adal = require('adal-node');
import { Context } from '@azure/functions';
// internal modules
import Contract from './models/Contract';
import GraphAPI from './models/GraphAPI';
import {
  API_VERSION,
  GRAPH_BASE_URL,
  SP_ACD_SITE_ID,
  TENANT
} from './constants';
import { replacePlaceHolders } from './utils';

// Create a new contract with default values
export async function createDefaultContract(
  projectID: string,
  contractType: string,
  clientID: string,
  clientSecret: string,
  context: Context
) {
  const API = new GraphAPI();

  try {
    await API.initialize({
      adal,
      clientID,
      clientSecret,
      graphBaseURL: GRAPH_BASE_URL,
      tenant: TENANT,
      siteID: SP_ACD_SITE_ID,
      apiVersion: API_VERSION,
      context
    });

    const contract = new Contract({
      projectID,
      type: contractType,
      API,
      context
    });

    await contract.generateContractText(replacePlaceHolders);

    const { info, err } = await contract.saveToSharepoint();

    if (err) {
      return {
        err,
        info: null
      };
    }

    return {
      err: null,
      info: info
    };
  } catch (err) {
    console.error(err);
    return {
      err,
      info: null
    };
  }
}
