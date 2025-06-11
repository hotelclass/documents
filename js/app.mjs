// app.js
import express from 'express';
import {Process} from './process.mjs'
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/gitprocess', (req, res) => {
    console.log('Webhook recibido');
    const proc = new Process(req, process.env.GITHUB_TOKEN);
    const signature = req.headers['x-hub-signature-256'];
    //console.log('signature', signature);
    
    const ref = req.body.ref;  // ejemplo: 'refs/heads/main'
    
    if (ref !== 'refs/heads/main') {
      console.log('Push a rama no principal, ignorado:', ref);
      return res.status(200).send('Rama no autorizada, no se procesa.');
    }    
    
    //const urlfull = `${req.body.repository.url}/contents/${req.body.head_commit.modified[0]}?ref=${req.body.repository.default_branch}`;
    proc.run();
    res.status(200).send('Process complete');
    
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
