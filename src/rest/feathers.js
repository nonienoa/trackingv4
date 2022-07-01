import feathers from '@feathersjs/client';

const restClient = feathers().configure(
  feathers.rest('https://trackingcms.boafresh.com').fetch(fetch)
);

export default restClient;
