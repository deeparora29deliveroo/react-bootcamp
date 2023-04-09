// eslint-disable-next-line prettier/prettier
import type { Application } from 'express';
import { hasAllScopesMiddleware, hasAnyScopesMiddleware } from '@deliveroo/express-identity';

import logger from '../logger';

export default (app: Application) => {
  logger.warn(
    "The post-auth hook is enabled. Remove this hook if you don't need it. https://github.com/deliveroo/create-deliveroo-tool/blob/master/docs/generated/interfaces/ServerHooks.md",
  );

  app.get('/env', (_req, res) => {
    // This endpoint has been added to show the difference between what the
    // server can access vs what the client application can access. In
    // production systems, you should think twice about exposing API keys and
    // passwords to the public/client applications, as they can easily be copied
    // from network logs and used elsewhere. If you do have API keys that are to
    // be used by the client, make sure that they're protected by other means,
    // such as allowlisting domains from where the API key was provisioned.

    res.json({
      ENVIRONMENT_NAME: process.env.ENVIRONMENT_NAME,

      // This environment variable is defined in Terraform/CircleCI, accessible
      // at the Docker build phase both for the client (when made PUBLIC_ in
      // cdt.config.js), or the server as its original name
      EXAMPLE_BUILD_ENV_VAR: process.env.EXAMPLE_BUILD_ENV_VAR,

      // This is a runtime environment variable, defined by Hopper and only
      // accessible from the server (i.e. when running yarn run start)
      EXAMPLE_RELEASE_ENV_VAR: process.env.EXAMPLE_RELEASE_ENV_VAR,
    });
  });

  app.get('/api/sample', (_req, res) => {
    setTimeout(() => {
      res.json({ data: { msg: 'This text came from your custom server hook' } });
    }, 1000);
  });

  app.get('/api/session', (req, res) => {
    if (!req.identity) {
      res.json({
        msg: 'Something has gone wrong and req.identity does not exist. Check if authEnabled is true https://github.com/deliveroo/create-deliveroo-tool#authentication',
        data: null,
      });
      return;
    }

    /*
      Information about what data to find in the req.identity object can be found in the following places:

      - Request (req.identity) -> https://github.com/deliveroo/js-common/blob/master/packages/express-identity/src/awsElbAuth.ts#L18
      - AccessToken -> https://github.com/deliveroo/js-common/blob/master/packages/jwt/src/types.ts#L29
      - IdToken -> https://github.com/deliveroo/js-common/blob/master/packages/jwt/src/types.ts#L39
    */
    res.json({
      msg: 'There is some data from the identity object',
      data: {
        email: req.identity.idToken.email,
        name: req.identity.idToken.name,
        scopes: req.identity.accessToken.scope,
      },
    });
  });

  app.get(
    '/api/example-access/middleware-all-required/yep',
    hasAllScopesMiddleware(['openid']),
    (_req, res) => {
      res.json({ msg: 'you have access!' });
    },
  );

  app.get(
    '/api/example-access/middleware-all-required/nope',
    hasAllScopesMiddleware(['openid', 'this-will-not-be-here']),
    (_req, res) => {
      res.json({ msg: 'you do not have access!' }); // should never see this message
    },
  );

  app.get(
    '/api/example-access/middleware-some-required/yep',
    hasAnyScopesMiddleware(['openid', 'this-will-not-be-here']),
    (_req, res) => {
      res.json({ msg: 'you have access!' });
    },
  );

  app.get(
    '/api/example-access/middleware-some-required/nope',
    hasAnyScopesMiddleware(['this-will-not-be-here']),
    (_req, res) => {
      res.json({ msg: 'you do not have access!' }); // should never see this message
    },
  );

  app.get('/api/example-access/request-identity-object-helpers', (req, res) => {
    const scope = 'openid';
    const hasAccess = req.identity.utils.hasAllScopes([scope]);

    res.json({ data: [{ scope, hasAccess }] });
  });
};
