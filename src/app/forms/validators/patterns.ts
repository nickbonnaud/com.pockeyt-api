export const patterns = {
  website: '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$',
  numbers_only: '[0-9]*',
  letters_dashes_spaces: '/^[-sa-zA-Z]+$/',
  numbers_dashes_spaces_parenthesis: '/(((d{3}) ?)|(d{3}-))?d{3}-d{4}/',
  date: '/^(0[1-9]|1[0-2])/(0[1-9]|1d|2d|3[01])/(19|20)d{2}$/',
  ssn: '/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/'
};
