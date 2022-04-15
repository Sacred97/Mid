// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/midkam_api/',
  daDataConfig: {
    apiKey: '0124fbdc0ad6a70ba2e03f5b3f2399fb935a60db',
    secret: '9c5a329936e1085d0e5ce83f96175ee791ff0c60',
    addressUrl: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
    companyUrl: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party'
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
