const env = process.env.ENVIRONMENT_NAME || 'development';
const isProduction = ['staging', 'production'].includes(env);

exports.isProduction = isProduction;
exports.env = env;
