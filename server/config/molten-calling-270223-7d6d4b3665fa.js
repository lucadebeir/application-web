const dotenv = require("dotenv");
dotenv.config();

exports.type = "service_account";
exports.project_id = process.env.PROJECT_ID;
(exports.project_id = process.env.PROJECT_ID),
  (exports.private_key_id = process.env.PRIVATE_KEY_ID),
  (exports.private_key = process.env.PRIVATE_KEY),
  (exports.client_email = process.env.CLIENT_EMAIL),
  (exports.client_id = process.env.CLIENT_ID),
  (exports.auth_uri = process.env.AUTH_URI),
  (exports.token_uri = process.env.TOKEN_URI),
  (exports.auth_provider_x509_cert_url = process.env.AUTH_PROVIDER_CERT_URL),
  (exports.client_x509_cert_url = process.env.CLIENT_CERT_URL);
