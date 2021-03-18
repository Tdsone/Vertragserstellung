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

  constructor({ projectID, API, text = '', type = '', templateText = '' }) {
    this.type = type;
    this.text = text;
    this.API = API;
    this.projectID = projectID;
    this.templateText = templateText;
  }

  async fetchContractTemplateText() {
    let itemID = CONTRACT_TEMPLATE_ID_MAP.get(this.type);
    const fields = await this.API.getSingleSPListItemFields(
      SP_VERTRAGSVORLAGEN_LIST_ID,
      itemID
    );
    this.setTemplateText(fields.Vertragstext);
  }

  async generateGbRVertragPlaceholderMap() {
    // TODO
    return new Map();
  }

  async generateControllerVertragPlaceholderMap() {
    const project = new Project(this.projectID, this.API);
    const members = await project.getMembers();

    const controller = await project.getController();
    const projektleiter = await project.getProjektleiter();
    const projektmitglieder = await project.getProjektmitglieder();

    const placeholderMap: PlaceholderMap = new Map([
      ['ControllerVorname', controller.Vorname],
      ['ControllerNachname', controller.Nachname],
      ['ControllerStadt', controller.Stadt],
      ['ControllerPLZ', controller.PLZ],
      ['ControllerStrasse', controller.Strasse],
      ['ControllerHausnummer', controller.Hausnummer],
      ['ProjektleiterVorname', projektleiter.Vorname],
      ['ProjektleiterNachname', projektleiter.Nachname],
      ['GbRName', await project.getGbRName()],
      ['GbRStadt', projektleiter.Stadt],
      ['GbRPLZ', projektleiter.PLZ],
      ['GbRStrasse', projektleiter.Strasse],
      ['GbRHausnummer', projektleiter.Hausnummer]
    ]);

    return placeholderMap;
  }

  // Treuhand und Provisionsvertrag enthält keine Placeholder
  async generateTreuhUndProvisVertragPlaceholderMap() {
    return new Map();
  }

  async generateBeratVertragPlaceholderMap() {
    // TODO
    const placeholderMap = new Map();
    return placeholderMap;
  }

  // fetches default values and the respective placeholders and save them to a graphAPI list
  async generateDefaultPlaceholderValueMap() {
    switch (this.type) {
      case GBR_VERTRAG:
        return await this.generateGbRVertragPlaceholderMap();
      case BERATUNGS_VERTRAG:
        return await this.generateBeratVertragPlaceholderMap();
      case CONTR_VERTRAG:
        return await this.generateControllerVertragPlaceholderMap();
      case TREUH_PROVIS_VERTRAG:
        return await this.generateTreuhUndProvisVertragPlaceholderMap();
      default:
        throw new Error(
          'There is no matching function for the given contract type'
        );
    }
  }

  // creates a contract text out of a template with placeholders and the replacements
  async generateContractText(replacePlaceholders: Function) {
    let templateText: string;
    let placeholderValueMap: Map<string, string>;

    try {
      let promises: Promise<any>[] = [
        this.fetchContractTemplateText(),
        this.generateDefaultPlaceholderValueMap()
      ];
      const data = await Promise.all(promises);

      templateText = data[0];
      placeholderValueMap = data[1];

      if (!templateText || !placeholderValueMap) {
        throw new Error(
          'An error occurred fetching default values or template'
        );
      }
    } catch (error) {
      console.error(error);
    }

    const text = replacePlaceholders(templateText, placeholderValueMap);
    this.setText(text);
  }

  async saveToSharepoint() {}

  // setter

  setText(text: string) {
    this.text = text;
  }

  setTemplateText(text: string) {
    this.templateText = text;
  }
}
