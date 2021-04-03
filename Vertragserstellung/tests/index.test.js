const utils = require('../utils');

test('Tests if all placeholders are replaced correctly', () => {
  const placeholderValueMap = new Map([
    ['name', 'Rudolf'],
    ['volume', '12'],
    ['kommtnichtvor', 'troelf']
  ]);
  const text =
    'Der Hahn mit Namen ##name## schrie mit Lautstärke ##volume##. Allerdings hatte ##name## einen Brotkrumen im Hals und erstickte in Folge daran.';

  const replaced = utils.replacePlaceHolders(text, placeholderValueMap, '##');

  return expect(replaced).toBe(
    'Der Hahn mit Namen Rudolf schrie mit Lautstärke 12. Allerdings hatte Rudolf einen Brotkrumen im Hals und erstickte in Folge daran.'
  );
});

test('Parse firstname correctly from email', () =>
  expect(
    utils.parseFirstNameFromEmail('timon.schneider@academyconsult.de')
  ).toBe('Timon'));

test('Parse lastname correctly from email', () =>
  expect(
    utils.parseLastNameFromEmail('timon.schneider@academyconsult.de')
  ).toBe('Schneider'));

test('Create GbR Name from lastnames', () => {
  expect(
    utils.createGbRNameFromLastNames(['Schneider', 'Winkler', 'Engel'])
  ).toBe('Schneider-Winkler-Engel GbR');
});
