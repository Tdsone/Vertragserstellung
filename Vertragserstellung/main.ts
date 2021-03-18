// external modules/packages
const adal = require('adal-node');
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
  clientSecret: string
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
      apiVersion: API_VERSION
    });

    const contract = new Contract({
      projectID,
      type: contractType,
      API
    });

    await contract.generateContractText(replacePlaceHolders);

    const linkToSPEntry = await contract.saveToSharepoint();

    return {
      error: null,
      info: linkToSPEntry
    };
  } catch (error) {
    console.error(error);
    return {
      error,
      info: null
    };
  }
}
