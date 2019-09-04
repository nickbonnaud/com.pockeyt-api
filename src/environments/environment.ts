// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  app_name: 'Heist',
  google_api_key: 'AIzaSyCRh9F7rjZFYmAgVbn8_89m0L_Cyj-QC10',

  urls: {
    base: 'http://pockeyt.local/',
    register: 'api/business/auth/register',
    login: 'api/business/auth/login',
    logout: 'api/business/auth/logout'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
