import express from 'express';
import './websockets.js';
import { join } from 'path';

const app = express();

app.get('/', (req, res) => {
    res.sendFile(join(import.meta.dirname, '../../emulator.html'));
});

app.use(express.static(join(import.meta.dirname, '../../miedit')));

app.listen(8000, '0.0.0.0', () => console.log('hlo'));
