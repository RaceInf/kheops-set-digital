const express = require('express');
const cors = require('cors');
const ga4Routes = require('./ga4');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use('/api/ga4', ga4Routes);

app.get('/', (req, res) => {
  res.send('GA4 server-side tracking API is running.');
});

app.listen(PORT, () => {
  console.log(`GA4 server-side API listening on port ${PORT}`);
}); 