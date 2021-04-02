import { Context } from '@azure/functions';
import GraphAPI from './GraphAPI';

import {
  SP_VERTRAGSVORLAGEN_LIST_ID,
  CONTRACT_TEMPLATE_ID_MAP,
  GBR_VERTRAG,
  BERATUNGS_VERTRAG,
  CONTR_VERTRAG,
  TREUH_PROVIS_VERTRAG
} from '../constants';
import Project from './Project';
import { PlaceholderMap } from './CustomTypes';
import Member from './Member';

// Class
export default class Contract {
  type: string;
  text: string;
  projectID: string;
  API: GraphAPI;
  templateText: string;
  context: Context;
  placeholderMap: PlaceholderMap;

  constructor({
    projectID,
    API,
    text = '',
    type = '',
    templateText = '',
    context = null
  }) {
    this.type = type;
    this.text = text;
    this.API = API;
    this.projectID = projectID;
    this.templateText = templateText;
    this.context = context;
    this.placeholderMap = null;
  }

  async fetchContractTemplateText() {
    this.context.log('Fetching contract...');
    let itemID = CONTRACT_TEMPLATE_ID_MAP.get(this.type);
    const fields = await this.API.getSingleSPListItemFields(
      SP_VERTRAGSVORLAGEN_LIST_ID,
      itemID
    );
    this.setTemplateText(fields.Vertragstext);
  }

  async generateGbRVertragPlaceholderMap(): Promise<PlaceholderMap> {
    // TODO
    return new Map();
  }

  async generateControllerVertragPlaceholderMap(): Promise<PlaceholderMap> {
    const project = new Project(this.projectID, this.API, this.context);
    const members = await project.getMembers();

    const controller = await project.getController();
    const projektleiter = await project.getProjektleiter();

    const placeholderMap: PlaceholderMap = new Map([
      ['CONTROLLER_VORNAME', controller.Vorname],
      ['CONTROLLER_NACHNAME', controller.Nachname],
      ['CONTROLLER_STADT', controller.Stadt],
      ['CONTROLLER_PLZ', controller.PLZ],
      ['CONTROLLER_STRASSE', controller.Strasse],
      ['CONTROLLER_HAUSNUMMER', controller.Hausnummer],
      ['PROJEKTLEITER_VORNAME', projektleiter.Vorname],
      ['PROJEKTLEITER_NACHNAME', projektleiter.Nachname],
      ['GBR_NAME', await project.getGbRName()],
      ['GBR_STADT', projektleiter.Stadt],
      ['GBR_PLZ', projektleiter.PLZ],
      ['GBR_STRASSE', projektleiter.Strasse],
      ['GBR_HAUSNUMMER', projektleiter.Hausnummer]
    ]);

    return placeholderMap;
  }

  // Treuhand und Provisionsvertrag enthält keine Placeholder
  async generateTreuhUndProvisVertragPlaceholderMap(): Promise<PlaceholderMap> {
    return new Map();
  }

  async generateBeratVertragPlaceholderMap(): Promise<PlaceholderMap> {
    // TODO
    const placeholderMap = new Map([['Hi', 'hi']]);
    return placeholderMap;
  }

  // fetches default values and the respective placeholders and save them to a graphAPI list
  async generateDefaultPlaceholderValueMap(): Promise<void> {
    switch (this.type) {
      case GBR_VERTRAG:
        this.placeholderMap = await this.generateGbRVertragPlaceholderMap();
        break;
      case BERATUNGS_VERTRAG:
        this.context.log('Creating placeholder map for type Beratungsvertrag');
        this.placeholderMap = await this.generateBeratVertragPlaceholderMap();
        break;
      case CONTR_VERTRAG:
        this.placeholderMap = await this.generateControllerVertragPlaceholderMap();
        break;
      case TREUH_PROVIS_VERTRAG:
        this.placeholderMap = await this.generateTreuhUndProvisVertragPlaceholderMap();
        break;
      default:
        throw new Error(
          'There is no matching function for the given contract type'
        );
    }
  }

  // creates a contract text out of a template with placeholders and the replacements
  async generateContractText(replacePlaceholders: Function) {
    try {
      let promises: Promise<any>[] = [
        this.fetchContractTemplateText(),
        this.generateDefaultPlaceholderValueMap()
      ];

      await Promise.all(promises);

      if (!this.templateText || !this.placeholderMap) {
        throw new Error(
          'An error occurred fetching default values or template'
        );
      }
    } catch (error) {
      this.context.log(error);
    }

    const text = replacePlaceholders(this.templateText, this.placeholderMap);
    this.setText(text);
  }

  async saveToSharepoint() {
    // TODO replace with real values
    const data = {
      fields: {
        Title: `${this.type}-${this.projectID}`, // projekt id plus vertragstyp
        ProjektID: this.projectID,
        VertragsvorlageID: 2,
        Vertragstext: this.text,
        LinkZumDokument: 'https://google.com'
      }
    };
    const res = await this.API.createNewListItem(data, '3_ProjektVertraege');
    if (!res.info) {
      return {
        info: null,
        err: res.err
      };
    }

    return {
      info: res.info,
      err: null
    };
  }

  // setter

  setText(text: string) {
    this.text = text;
  }

  setTemplateText(text: string) {
    this.templateText = text;
  }
}
