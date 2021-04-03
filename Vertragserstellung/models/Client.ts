import { Context } from '@azure/functions';
import GraphAPI from './GraphAPI';
import { SP_KUNDEN_LIST_ID, SP_KONTAKTE_LIST_ID } from '../constants';
import { Contact } from './CustomTypes';

export default class Client {
  companyName: string;
  API: GraphAPI;
  context: Context;
  street: string;
  city: string;
  PLZ: string;
  contactPerson: Contact;

  constructor(context, API: GraphAPI) {
    this.companyName = '';
    this.street = '';
    this.city = '';
    this.context = context;
    this.contactPerson = null;
    this.API = API;
  }

  async initialize(clientID: string) {
    const clientData = await this.API.getSingleSPListItemFields(
      SP_KUNDEN_LIST_ID,
      clientID
    );

    this.companyName = clientData.Title;
    this.city = clientData.AdresseStadt;
    this.street = clientData.AdresseStra_x00df_e;
    this.PLZ = String(clientData.AdressePLZ);
  }
}
