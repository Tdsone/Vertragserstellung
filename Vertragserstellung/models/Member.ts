export default interface Member {
  ID: string;
  Projektrolle: string;
  firstName: string;
  lastName: string;
  Stadt: string;
  Postleitzahl: string;
  Strasse: string;
  Hausnummer: string;
  EmailAC: string;
}

export function sortByLastname(a: Member, b: Member): number {
  if (a.lastName < b.lastName) {
    return -1;
  }
  return 1;
}
