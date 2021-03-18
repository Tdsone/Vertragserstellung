export default interface Member {
  ID: string;
  Projektrolle: string;
  Vorname: string;
  Nachname: string;
  Stadt: string;
  PLZ: string;
  Strasse: string;
  Hausnummer: string;
}

export function sortByNachname(a: Member, b: Member): number {
  if (a.Nachname < b.Nachname) {
    return -1;
  }
  return 1;
}
