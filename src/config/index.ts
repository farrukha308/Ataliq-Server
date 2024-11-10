const v8 = require('v8');

let stripeKey = null;
let userId = null;
let userApiKey = null;
let developerId = null;
let paymentGateway = null;
if (!process.env.server_env) {
  process.env.server_env = 'prod';
}
if (process.env.server_env == 'dev') {
  stripeKey = process.env.STRIPE_KEY_DEV;
  userId = process.env.USER_ID_DEV;
  userApiKey = process.env.USER_API_KEY_DEV;
  developerId = process.env.DEVELOPER_ID_DEV;
  paymentGateway = process.env.PAYMENT_GATEWAY;

  console.log('if dev');
  console.log('userId--->', userId);
  console.log('userApiKey--->', userApiKey);
  console.log('developerId--->', developerId);

  // console.log(stripeKey)
} else if (process.env.server_env == 'prod') {
  stripeKey = process.env.STRIPE_KEY_PROD;
  console.log('else prod');
  const v8 = require('v8');
  v8.setFlagsFromString(process.env.NODE_OPTIONS);
  //   userId = process.env.STRIPE_KEY_PROD;
  //   userApiKey = process.env.STRIPE_KEY_PROD;
  //   developerId = process.env.STRIPE_KEY_PROD;
  // console.log(stripeKey)
}

module.exports = { stripeKey, userId, userApiKey, developerId, paymentGateway };
