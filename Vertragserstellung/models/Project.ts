import GraphAPI from './GraphAPI';
import {
  SP_PROJEKTE_LIST_ID,
  SP_PROJEKTE_BEWERBUNGEN_LIST_ID,
  SP_MITGLIEDER_LIST_ID
} from '../constants';
import Member, { sortByLastname } from './Member';
import { Context } from '@azure/functions';
import Client from './Client';
import {
  createGbRNameFromLastNames,
  parseFirstNameFromEmail,
  parseLastNameFromEmail
} from '../utils';

export default class Project {
  ID: string;
  API: GraphAPI;
  title: string;
  members: Array<Member>;
  unternehmenID: string;
  client: Client;
  context: Context;

  constructor(ID: string, API: GraphAPI, context: Context) {
    this.ID = ID;
    this.API = API;
    this.context = context;
    this.client = null;
  }

  async initialize() {
    const data = await this.API.getSingleSPListItemFields(
      SP_PROJEKTE_LIST_ID,
      this.ID
    );

    if (!data.UnternehmenID) {
      this.context.res = {
        status: 400,
        body:
          'The property UnternehmenID in SharePoint List 3_Projekte is missing so no contract was created.'
      };
      return this.context.done();
    }
    this.unternehmenID = String(data.UnternehmenID);

    this.title = data.Title;
  }

  async getClient() {
    if (this.client) {
      return this.client;
    }
    this.client = new Client(this.context, this.API);

    if (this.unternehmenID) await this.client.initialize(this.unternehmenID);

    return this.client;
  }

  async getMembers(): Promise<Array<Member>> {
    let projectMembers = [];
    if (!this.members) {
      this.context.log('Trying to fetch project members');
      const bewerbungen = await this.API.getMultipleSPListItems(
        SP_PROJEKTE_BEWERBUNGEN_LIST_ID,
        `fields/ProjektID eq ${this.ID}`
      );

      if (!bewerbungen || bewerbungen.length == 0) {
        this.context.log(
          'No applications for this project were found => contract cannot be created. Aborting...'
        );
        this.context.res = {
          status: 400,
          body:
            'No applications for this project could be found. No contract was created'
        };
        this.context.done();
        return [];
      }

      projectMembers = bewerbungen.filter((bewerbung) => bewerbung.Besetzt);

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

      this.context.log('\n----Member data-----\n');
      this.context.log(memberData);
      // merge data from list 3_ProjektBewerbungen and 1_Mitglieder
      projectMembers = projectMembers
        .map((member, index) => Object.assign(member, memberData[index]))
        .map((member) => {
          member.firstName = parseFirstNameFromEmail(member.EmailAC);
          member.lastName = parseLastNameFromEmail(member.EmailAC);
          return member;
        });
    }

    this.members = projectMembers;
    return projectMembers;
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
    let members = this.members;

    if (!this.members) {
      members = await this.getMembers();
    }
    const projektleiter = members.filter(
      (member) => member.Projektrolle == 'Projektleitung'
    )[0];

    this.context.log('--PROJEKTLEITER--');
    this.context.log(projektleiter);
    return projektleiter;
  }

  async getProjektmitglieder(): Promise<Array<Member>> {
    let members = this.members;
    if (!this.members) {
      members = await this.getMembers();
    }
    const projektmitglieder = members.filter(
      (member) => member.Projektrolle == 'Projektmitglied'
    );
    return projektmitglieder;
  }

  async getGbRName(): Promise<string> {
    const projektleiter = await this.getProjektleiter();
    const projektmitglieder = await this.getProjektmitglieder();

    const namen = projektmitglieder
      .sort(sortByLastname)
      .map((member) => member.lastName);

    // projektleiter shoud come first in gbr name
    namen.unshift(projektleiter.lastName);

    return createGbRNameFromLastNames(namen);
  }
}
