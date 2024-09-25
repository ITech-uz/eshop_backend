const { expressjwt } = require("express-jwt");



function authJwt() {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;

  return expressjwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      // Exclude specific paths from authentication
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}
// async function isRevoked(req, payload) {
//   // If the user is not an admin, we revoke the token
//   console.log(payload);
//
//   if (!payload.isAdmin) {
//     // Throw an error to indicate the token should be revoked
//     return new Error('Token is revoked');
//   }
//   // If the token is valid (admin user), just return
//   return false;
// }

module.exports = authJwt;
