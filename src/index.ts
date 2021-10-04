import 'dotenv';
import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import connectDB  from './config/db';

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
