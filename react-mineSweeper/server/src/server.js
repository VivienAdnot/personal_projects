import express from 'express';
import bodyParser from 'body-parser';
import rethinkdbdash from 'rethinkdbdash';
import cors from 'cors';
import config from 'config';
import { run } from './bootstrap';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

global.rethinkdb = rethinkdbdash(config.rethinkdb);

app.get('/', (req, res) => res.send({ serverLive: true }));

run(app);

app.listen(8089);
console.log('server listening on 8089, rdb connected on 28015');
