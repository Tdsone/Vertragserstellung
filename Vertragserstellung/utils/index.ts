import { PlaceholderMap } from '../models/CustomTypes';

function replacePlaceHolders(
  text: string,
  placeholderValueMap: PlaceholderMap,
  delimiter: string // ++ is the delimiter where ++Placholder++ is the occurence in the text that should be replaced
): string {
  let modifiedText = text;

  // replaces all occurences of placeholder with value in text
  for (let [placeholder, value] of placeholderValueMap.entries()) {
    const pattern = `${delimiter}${placeholder}${delimiter}`;
    const re = new RegExp(pattern, 'g');
    modifiedText = modifiedText.replace(re, value);
  }

  return modifiedText;
}

// replace all special characters with HTML conform characters (e.g. § -> &sect;)
function replaceSpecialCharacters(text: string): string {
  let replacedText = text.replace('§', '&sect;');
  return replacedText;
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function parseFirstNameFromEmail(email: string) {
  const firstName = email.slice(0, email.indexOf('.'));
  return capitalize(firstName);
}

function parseLastNameFromEmail(email: string) {
  const lastName = email.slice(email.indexOf('.') + 1, email.indexOf('@'));
  return capitalize(lastName);
}

function createACMailAddress(firstName: string, lastName: string) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@acedemyconsult.de`;
}

function createGbRNameFromLastNames(lastnames: Array<String>) {
  let gbrName = lastnames[0];
  for (var i = 1; i < lastnames.length; i++) {
    gbrName += '-' + lastnames[i];
  }

  return gbrName + ' GbR';
}

export {
  replacePlaceHolders,
  createACMailAddress,
  replaceSpecialCharacters,
  parseFirstNameFromEmail,
  parseLastNameFromEmail,
  createGbRNameFromLastNames
};
