import GraphAPI from './GraphAPI';
import {
  SP_PROJEKTE_LIST_ID,
  SP_PROJEKTE_BEWERBUNGEN_LIST_ID
} from '../constants';
import Member from './Member';

export default class Project {
  ID: string;
  projectInfo: object;
  API: GraphAPI;
  members: Array<Member>;

  constructor(ID, API) {
    this.ID = ID;
    this.API = API;
  }

  async getMembers(): Promise<Array<Member>> {
    let members = [];
    if (!this.members) {
      const bewerbungen = await this.API.getMultipleSPListItems(
        SP_PROJEKTE_BEWERBUNGEN_LIST_ID
      );
      // TODO potentially really slow => use OData to specify which items to get instead of whole list
      members = bewerbungen.filter(
        (bewerbung) => bewerbung.Besetzt && bewerbung.ProjektID == this.ID
      );
      this.members = members;
    }
    return this.members;
  }

  async getController(): Promise<Member> {
    if (!this.members) {
      await this.getMembers();
    }
    const controller = this.members.filter(
      (member) => member.Projektrolle == 'Projektcontrolling'
    )[0];

    return controller;
  }

  async getProjektleiter(): Promise<Member> {
    if (!this.members) {
      await this.getMembers();
    }
    const projektleiter = this.members.filter(
      (member) => member.Projektrolle == 'Projektleitung'
    )[0];
    return projektleiter;
  }

  async getProjektmitglieder(): Promise<Array<Member>> {
    if (!this.members) {
      await this.getMembers();
    }
    const projektmitglieder = this.members.filter(
      (member) => member.Projektrolle == 'Projektleitung'
    );
    return projektmitglieder;
  }

  async getInfo() {
    const data = await this.API.getSingleSPListItemFields(
      SP_PROJEKTE_LIST_ID,
      this.ID
    );
    return data;
  }
}
