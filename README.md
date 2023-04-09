# React App Template

This is a template repo that aims to simplify the process of spinning up web applications. Just click the "Use this template"
button near the top and you're pretty much ready to go (when it comes to local development).

## STOP! You have a choice to make

Before you go any further using this repository, you must make the decision to use JavaScript or TypeScript. To do this, choose which command to run of:

```bash
yarn choose:typescript
yarn choose:javascript
```

You will not be able to run any scripts before making this decision, and will see an error message if you have not done so.

Running either one will **destructively** configure the repo for your decision, and leave the changes for you to commit. If you've made a mistake, run `git restore .` to get the repo back into the initial state, and you can make the decision again.

## Commands

1. `yarn dev` - Starts the app in development mode with hot-reloading when anything changes
2. `yarn build` - Builds your app, minify all assets etc. ready for production deployment
3. `yarn start` - Use this command to start you app in production. This assumes you have previously built the app using `yarn build`
4. `yarn test` - Runs any tests that match the pattern: `*.test.js`
   - To run you tests in watch mode you can run: `yarn test --watchAll`
   - For more command line options, check out the [jest cli docs](https://facebook.github.io/jest/docs/en/cli.html)
5. `yarn lint` - Runs linting on all javascript files in your app (ignoring anything which is in the .gitignore)
   - To fix any automatically fixable lint issues you can run: `yarn lint --fix`

## Use locally

Running `yarn dev` or `yarn build && yarn start` (with or without a `PORT=` environment variable set) will output a suitable URL for you to access your service.

When using `yarn dev` with the `openUrl` parameter set (in the `serverConfig` of your `cdt.config.js`) a browser window will be automatically opened for you once initial loading of your server is complete.

This template makes use of the `openUrlWithPumaDev` function, which will use [puma-dev](https://github.com/puma/puma-dev) (if installed) to serve your app over HTTPS and at a production-like URL (https://cdt-created-app.deliveroo.net.test — with `.test` at the end). This URL will be correct no matter what your `PORT=` env var is set to when you `yarn dev`.

Please note that you may need to run the following commands for puma to recognise the new configuration:

```sh
$ sudo puma-dev -setup
$ puma-dev -install
```

## App Workflow

This application is set up using a `staging` and `master` branch. We would hope that people would:

1. Submit their PR to this repo
2. Have the PR reviewed
3. Merge into `staging` branch (via cmd)
4. Wait for deployment and verify changes are working as expected
5. Merge into `master` branch (via github)

### Resetting Staging

"Resetting" the staging branch is quite common. To help with this, run `yarn reset-staging`.

Under the hood, this uses the [`@deliveroo/reset-staging`](https://github.com/deliveroo/js-common/tree/master/packages/reset-staging)
npm module. You will require an local environment variable to execute this command. The default variable used is `GITHUB_TOKEN`, but
can always be changed in the npm script, located in the `package.json`.

## Create Deliveroo Tool (CDT)

Create Deliveroo Tool (CDT) is used behind the scenes to run this application. It has it's [own repo][cdt-repo] that provides
lots of [documentation][cdt-docs] about how to use and customize it.

## Getting your app to Staging/Production

**Note**: This repo/app has all it's infrastructure setup and deploys to staging and production on merges to staging and master respectively. See links below.

Let's talk about what it takes to get your app into production.

1. Your app already has a `Dockerfile`, so please modify it for your purposes
2. Update the following in your GitHub repository:
   - grant _admin_ access to your team so you're not the only person who can make these changes
   - grant _write_ access to the "Engineering" group, so that CircleCI can access your codebase and build successfully
   - you may also want to consider adding a _branch protection rule_ for `master`
   - you may want to create a `staging` branch
3. [Setting up your Infrastructure](docs/getting-your-app-into-production.md#setting-up-the-infrastructure)
4. [Setting up Authentication](docs/getting-your-app-into-production.md#setting-up-authentication)
   - **Note:** You should setup authentication unless there is an explicit reason not to.
5. [Setup CircleCI](docs/getting-your-app-into-production.md#setup-circleci)

After all of this you should have a functioning app that can be tweaked at will.

If you have any problems with any of this, please reach out to [#prodeng](https://app.slack.com/client/T03EUNC3F/CBHGQUD4H), [#infrasec](https://app.slack.com/client/T03EUNC3F/C5UPZPP2P), or [#frontend-dev-general](https://app.slack.com/client/T03EUNC3F/C0ECC84P9) slack channels

[cdt-repo]: https://github.com/deliveroo/create-deliveroo-tool
[cdt-docs]: https://github.com/deliveroo/create-deliveroo-tool#using-cdtconfigjs-to-customise-your-app

## Contributing to app-react-template

If you wish to contribute to this repository, you should be aware of a few things.

### Javascript/Typescript

This repository is written in **TypeScript**, and transpiles to JavaScript when requested by the end-user. This is powered by the `choose:x` scripts in `package.json`. These do the following:

`choose:typescript`:

- Modify the config files as described in `scripts/chooseTypescriptConfigChanges.json`
- Remove dependencies as described in `scripts/chooseTypescriptDepsToRemove.json` (currently none)

`choose:javascript`:

- Remove `typings` folder
- Remove `app/*.d.ts` files
- Remove `tsconfig.json` and `tsconfig.server.json`
- Convert `import` to `require` syntax for the `app/server/*` files
- Use Babel to remove typescript syntax for `app/*` files
- Rename the (now-transpiled) `.ts(x)` files to `.js(x)`
- Modify the config files as described in `scripts/chooseJavascriptConfigChanges.json`
- Remove dependencies as described in `scripts/chooseJavascriptDepsToRemove.json`

Both:

- Switch out `.circleci/config.yml` and `Dockerfile` for legitimate versions
- Remove `scripts` folder
- Remove `execa` and `@babel/cli` dependencies
- Run the linter to fix any issues

The `scripts` folder contains some key files:

- `choose[X]ConfigChanges.json`: a list of changes that need to be made to the four config files used in this repository when choosing language X
- `choose[X]DepsToRemove.json`: a list of dependencies to be removed when choosing language X

There are some node scripts also present, which should not need to be touched. However, please ensure that you check your changes work as intended by getting your changes into a "saved" git state, then running `choose:javascript && yarn dev` to ensure everything is working.

**Note:** Running `choose:javascript` is a **destructive** process and will modify the files locally, and git commit the decision. Ensure you have committed your contributed changes _before_ running this command, so you can `git restore .` to restore your working files to your committed versions.

### CircleCI Config duplication

Due to the nature of the CI pipeline for the `app-template-react` repository needing to run on both the Javascript and Typescript decision paths, the CircleCI config is incompatible with the "end result". Therefore there is a `-template` version is provided, that will be used once a decision on JS/TS has been made.

### Ease of use

The aim of this repository is to be easy to set up for anyone at Deliveroo, regardless of JS/TS and frontend/backend knowledge. Always write changes with this in mind, and ensure the `choose:x` scripts set up a new user with everything they need out the box, and ready to go.
