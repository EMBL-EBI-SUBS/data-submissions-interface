// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  apiHost: 'https://submission-dev.ebi.ac.uk/api/',
  authenticationHost: 'https://explore.api.aai.ebi.ac.uk',
  validationSchemaEndpoint: 'https://subs-json-schema-validator.herokuapp.com/validate',
  dashboard: {
    reloadInterval: 60000
  }
};
