import GraphAPI from './GraphAPI';
import {
  SP_PROJEKTE_LIST_ID,
  SP_PROJEKTE_BEWERBUNGEN_LIST_ID,
  SP_MITGLIEDER_LIST_ID
} from '../constants';
import Member, { sortByNachname } from './Member';
import { Context } from '@azure/functions';

export default class Project {
  ID: string;
  projectInfo: object;
  API: GraphAPI;
  members: Array<Member>;
  context: Context;

  constructor(ID: string, API: GraphAPI, context: Context) {
    this.ID = ID;
    this.API = API;
    this.context = context;
  }

  async getMembers(): Promise<Array<Member>> {
    let projectMembers = [];
    if (!this.members) {
      const bewerbungen = await this.API.getMultipleSPListItems(
        SP_PROJEKTE_BEWERBUNGEN_LIST_ID
      );
      // TODO potentially really slow => use OData to specify which items to get instead of whole list
      projectMembers = bewerbungen.filter(
        (bewerbung) => bewerbung.Besetzt && bewerbung.ProjektID == this.ID
      );

      // fetch member data (e.g. address)
      const promises = [];
      for (let i = 0; i < projectMembers.length; i++) {
        promises.push(
          this.API.getSingleSPListItemFields(
            SP_MITGLIEDER_LIST_ID,
            projectMembers[i].MitgliedID
          )
        );
      }
      const memberData = await Promise.all(promises);

      // merge data from list 3_ProjektBewerbungen and 1_Mitglieder
      this.members = projectMembers.map((member, index) =>
        Object.assign(member, memberData[index])
      );
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
      (member) => member.Projektrolle == 'Projektmitglied'
    );
    return projektmitglieder;
  }

  async getGbRName(): Promise<string> {
    const projektleiter = await this.getProjektleiter();
    const projektmitglieder = await this.getProjektmitglieder();
    const namen = projektmitglieder
      .sort(sortByNachname)
      .reduce((prev, curr) => `${prev}-${curr.Nachname}`, ``);
    return `${projektleiter.Nachname}-${namen} GbR`;
  }
}
