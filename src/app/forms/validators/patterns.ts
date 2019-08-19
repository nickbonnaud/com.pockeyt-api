export const patterns = {
  website: '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$',
  numbers_only: '/^\d+$/;',
  letters_dashes_spaces: '/^[-\sa-zA-Z]+$/',
  numbers_dashes_spaces_parenthesis: '^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$',
  date: '/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/',
  ssn: '/^([1-9])(?!\1{2}-\1{2}-\1{4})[1-9]{2}-[1-9]{2}-[1-9]{4}/'
};
