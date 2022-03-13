const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/v1/auth/login', (req, res) => {
  const token = jwt.sign({
      id: 1,
      name: 'John Doe',
      email: 'John@gmail.com',
    },
    'hacktheplanet',
    { expiresIn: '1h' }
  );
  res.json({
    url: `http://localhost:3000/api/v1/auth/login/${token}`,
  });
});

app.get('/onetimelink', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, 'hacktheplanet', (err, decoded) => {
    if (err) {
      res.status(401).json({
        error: 'Failed to authenticate token.',
      });
    } else {
      res.json({
        decoded,
      });
    }
  });
});

app.get('/api/v1/auth/login/:token', (req, res) => {
    const token = req.params.token;
    jwt.verify(token, 'hacktheplanet', (err, decoded) => {
        if (err) {
            res.status(401).json({
                error: 'Failed to authenticate token.',
            });
        } else {
            res.json({
                decoded,
            });
        }
    });
});



app.get('/api/v1/auth/logout', (req, res) => {
  res.send('Logout');
});

app.get('/api/v1/auth/register', (req, res) => {
  res.send('Register');
});

app.get('/api/v1/auth/forgot-password', (req, res) => {
  res.send('Forgot Password');
});


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
