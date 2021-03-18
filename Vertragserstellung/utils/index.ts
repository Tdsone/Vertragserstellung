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

export { replacePlaceHolders };
