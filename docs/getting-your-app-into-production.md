# Getting Your App into Production

Before getting too much into it, let's explain a bit how infrastructure is created. At Deliveroo [Terraform](https://www.terraform.io/)
is used to manage infrastructure. Terraform is "infrastructure-by-code", meaning that you write code that describes your desired
infrastruture. Terraform will then translate into actual infrastructure on whatever hosting environment your using. Deliveroo uses AWS.

## Node.js Server Infrastructure

CDT can deploy a full Node.js server. This section will cover how to setup the infrastructure for this use case using the
`app-template-react` as an example.

This app will be deployed to AWS via Hopper.

First, go to the [app-infrastructure](https://github.com/deliveroo/app-infrastructure) repo. Take a look at the README and see if
there's a better place for your app to live. Usually teams have their own infrastructure repos in an effort to reduce the time of
Terraform runs.

In whatever repo you determine is the best fit for you app, let's start by creating your app. This will likely live under
a folder called `production` or `apps_production`, but it depends on the repo you're using. Please consult the owners of
that repo if it's not easily understandable.

I'm going to use `care-infrastructure` as an example, where the infrastructure for `app-template-react` is setup.

### Roo App Basic

First we need to create our app. This can be done by using the [`roo_app_basic`](https://github.com/deliveroo/terraform-modules/tree/main/modules/roo_app_basic)
Terraform module. We can see this in the [app file](https://github.com/deliveroo/care-infrastructure/blob/master/shards/global/app-template-react.tf#L1-L15)
for `app-template-react`. When setting this up, please use the latest version and fill out all necessary keys/values.

- [Staging](https://hopper-staging.deliveroo.net/apps/app-template-react)
- [Production](https://hopper.deliveroo.net/apps/app-template-react)

### Public Web

Next we need to setup access to our server using the [`roo_service_public_web`](https://github.com/deliveroo/terraform-modules/blob/main/modules/roo-service/README.md#public_web-service)
Terraform module. We can see this beign done in the [app file](https://github.com/deliveroo/care-infrastructure/blob/master/shards/global/app-template-react.tf#L17-L25)
for `app-template-react`. Again, when setting this up, please use the latest version and fill out all necessary keys/values.

- [Staging](https://hopper-staging.deliveroo.net/apps/app-template-react#services)
- [Production](https://hopper.deliveroo.net/apps/app-template-react#services)

### Github Repo Access

Next, make sure the Deliveroo "Engineering" team has access to the repo where your app is stored. You should be able to
do this in the Settings tab of your repo.

While you're in the GitHub settings, you might also want to setup a _branch protection rule_ for master.

After you create this new file, you need to submit a PR to the repo that you chose. Once that's merged, you should see
your app showing up in Hopper.

The [#prodeng](https://app.slack.com/client/T03EUNC3F/CBHGQUD4H) channel is always helpful if you get stuck.

### Setting Up Your App's Domain

Before setting up your domains, please read [the docs](https://deliveroo.atlassian.net/wiki/spaces/EN/pages/3856610036/Provisioning+your+Application#Setup-external-domains)
on [Confluence](https://deliveroo.atlassian.net/wiki/spaces/EN/pages/3856597007/Engineering+Docs).

Domain configuration for `app-template-react` can be found [here](https://github.com/deliveroo/domains/blob/master/services/app-template-react.tf).

The domains for `app-template-react` are:

- Staging: [https://app-template-react.staging.deliveroo.net](https://app-template-react.staging.deliveroo.net/)
- Production: [https://app-template-react.deliveroo.net](https://app-template-react.deliveroo.net/)

### Setting Up Authentication

**Note**: Unless you have a specific reason not to, your app should have authentication. Good thing it's been made as simple as
possible by the Infrasec team and other contributors.

The preferred way to do authentication is at the ALB (application load balancer) level. This means that when requests come
to your app they have already been authenticated via the ALB. CDT has middleware that will validate these requests.

All we need to do is use the [identity_auth](https://github.com/deliveroo/terraform-modules/tree/main/modules/identity_auth) Terraform
Module. We can see this beign done in the [app file](https://github.com/deliveroo/care-infrastructure/blob/master/shards/global/app-template-react.tf#L27-L42)
for `app-template-react`.

You'll also need to update your CDT config to enable authentication. Refer to the [`enabledAuth`](https://github.com/deliveroo/create-deliveroo-tool/blob/master/docs/generated/interfaces/ServerConfig.md#enableauth)
section of the "Configuration Options -> ServiceConfig" documentation.

An example of how to do this is can be seen in the deprecated [`mentor-markeplace`](https://github.com/deliveroo/mentor-marketplace/blob/master/cdt.config.js)
repository.

## Hopper Config

This repo contains a `.hopper/config.yml` file. It should be sufficient enough to define what type of web container hopper should create
for you. Please see readme about the default branching strategy.

You will have to scale your service to 1 worker before an image will deploy successfully. By default your project will also have autodeploys
disabled.

## Setup CircleCI

This repo contains a `.circleci/config.yml` file.

The remaining task you'll need to do is to trigger your first run in the CircleCI web interface. This can be done by finding the project in
CircleCI and then pressing the "follow" button. After that, any new commits/branches will be picked up by CircleCI.

A CircleCI run consists of `build_test`, followed by `push_app_staging` or `push_app_prod` depending on whether you've pushed to the `staging` or `master` branch.

When this passes, the Docker image will be published and Hopper will trigger a release (assuming you've got autodeploys enabled in Hopper!)

## Static Assets Infrastructure

CDT can be used to generate static files and deploy them to S3 buckets.

Coming soon...
