# JWT Token

Stateless session

## Stacture of JWT

`Header`.`Payload`.`Signature`

```jwt

```

`Header`.`Payload`

```jwt

```

## Header is metadata about the token

```json
{
  "alg": "HS256" // algorithm: none, HS256, RS256, etc
}
```

> Note Hash Part

```js
JSON.stringify({
  alg: 'HS256',
});
```

> Base64Url

```js
const base64Url = require('base64-url')
const header = base64Url.encode(
    JSON.stringify({
        alg: 'HS256',
    });
)
```

## Payload is the message to send

```json
{
  "sub": "012345",
  "name": "John Doe",
  "admin": false
}
```

## Signature

`signature = f(header, payload, secret, algorithm`

```js
const crypto = require('crypto');
const base64Url = require('base64-url');

const secret = process.env.SECRET; // 256-bit secret
const content = `${header}.${payload}`;

const signature = base64Url.escape(
  crypto.createHmac('sha256', secret).update(content).digest('base64')
);
```

## Libary

```js
const jwt = require('jsonwebtoken');

const payload = {
  sub: '012345',
  name: 'John Doe',
  admin: false,
};

const secret = process.env.SECRET;

const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
```

## Verify Token

```js
const jwt = require('jsonwebtoken')

const secret = process.env.SECRET

jwt.verify(
    clientToken, secret, {
        algorithms: ['HS256', 'RS256']
    },
    function(err, payload) {
        if(err)
        else console.log(payload)
    }
)

```

## Cookie vs Token

**With Cookies**:

- cookies need a database / JWT are stateless
- the database is queried on each request
- vulnerable to CSRF (JWT are vuln to XSS)
- Sessions can be invalidated on demand

## Attack on JWT

1. Cross-site scripting (XSS)

   1. Unsanitized data on the backend

2. Using a weak algorithm for signature

   1. HS256 (HMAC + SHA256)
   2. RS256 (RSASSA-PKCS1-v1_5 + SHA256)
   3. ES256 (ECDSA + P-256 + SHA256)

3. Using a weak HMAC key/secret

   1. 'super-secret-key' **_[Bad Key]_**
   2. '31337passworddsaasdfeasd' **_[Bad Key]_**
   3. '' // 256-bit

4. Not verifying algorithm (Signature stripping attack)

   ```js
   jwt.verify(clientToken, secret, { algorithms: ['HS256', 'RS256'] });
   ```

5. Not verifying the alg (RS256 key as HS256 secret attack)

    ```js
    const decode = jwt.verify(token, publicRSKey)
    ```

    1. Regenerate token

    ```js
        const token = jwt.sign(payload, publicRSAKey, {algorithms: 'HS526'})

        <!-- after -->

        const decode = jwt.verift(token, publicRSAKey, {algorithms: ['HS256', 'RS256']})
    ```
