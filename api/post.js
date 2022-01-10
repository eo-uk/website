const fetch = require('isomorphic-fetch');

const checkRecaptcha = async (response, remoteAddress) => {
  if (response === undefined || response === '' || response === null) {
    return false;
  }

  const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;

  const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + response + '&remoteip=' + remoteAddress;
  console.log(verificationUrl);

  const data = await fetch(verificationUrl);
  const json = await data.json();

  if (json.success !== undefined && !json.success) {
    return false;
  }

  return true;
};

module.exports = async (req, res) => {
  const { body } = req;
  const { formID } = body;

  if (body['recaptcha-enabled']) {
    const recaptcha = await checkRecaptcha(body['g-recaptcha-response'], req.connection.remoteAddress);

    if (!recaptcha) {
      return res.end('Invalid recaptcha');
    }
  }

  if (body.url && body.url !== '') {
    return res.end('Invalid form');
  }

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/7361526/${formID}`;

  const fields = Object.keys(body)
    .flatMap((key) => {
      if (key !== 'formID' && key !== 'recaptcha-enabled') {
        return {
          name: key,
          value: body[key],
        };
      }
    })
    .filter(Boolean);

  const payload = {
    fields,
    legalConsentOptions: {
      // Include this object when GDPR options are enabled
      consent: {
        consentToProcess: true,
        text: 'I agree to allow Geolytix to store and process my personal data.',
        communications: [
          {
            value: true,
            subscriptionTypeId: 999,
            text: 'I agree to receive marketing communications.',
          },
        ],
      },
    },
  };

  const data = await fetch(url, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = await data.json();
  // console.log(json);

  res.writeHead(302, {
    Location: '/thanks/',
  });

  return res.end();
};
