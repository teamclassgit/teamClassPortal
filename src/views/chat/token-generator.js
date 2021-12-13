const AccessToken = require('twilio').jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

const tokenGenerator = () =>  {
  // Used when generating any kind of tokens
  const twilioAccountSid = "AC597968aead2e65ce2ef20c83f8b18fba";
  const twilioApiKey = 'SKd78cdbe7211cc94abc5416c4ce55161a';
  const twilioApiSecret = 'Configured properly';

  // Used specifically for creating Chat tokens
  const serviceSid = 'ISd1e35113099e4fba96b35a921b0cc8c4';
  const identity = 'Diego123';

  // Create a "grant" which enables a client to use Chat as a given user,
  // on a given device
  const chatGrant = new ChatGrant({
    serviceSid
  });

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    {identity}
  );

  token.addGrant(chatGrant);

  // Serialize the token to a JWT string and include it in a JSON response
  return {
    identity: token.identity,
    token: token.toJwt()
  };
};

export default tokenGenerator;