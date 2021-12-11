// todo: move pkg static server to nginx
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('pkg'));

const port = process.env.pkg_server_port || 6543;

app.listen(port, function() {
  console.log(`Serving pkg assets at http://localhost:${port}`);
});
