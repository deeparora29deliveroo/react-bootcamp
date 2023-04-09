import logger from '../logger';

export default () => {
  logger.warn(
    "The pre-auth hooks is enabled. Remove this hook if you don't need it. https://github.com/deliveroo/create-deliveroo-tool/blob/master/docs/generated/interfaces/ServerHooks.md",
  );
};
