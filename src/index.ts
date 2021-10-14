import 'dotenv';
import express, { Request, Response } from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db';
import User from './models/User';
import passport from './middleware/auth';
import jwt from 'jsonwebtoken';


const PORT = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET || 'secret';

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.send('API running');
});

app.get('/api/protect', passport.authenticate('jwt'), (req, res) => {
  res.send({ message: 'protected route' });
});


app.post('/api/signin',
  passport.authenticate('local'), (req: Request, res: Response) => {

    //generated token
    const token = jwt.sign({ _id: req?.user?._id }, jwtSecret, {
      expiresIn: '24h',
    });

    return res.status(200).json({ message: 'Sign in Successfully', token });
});

app.post('/api/signup', async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    await User.findOne({ email }).then((found: any) => {
      if (found) {
        return res.status(401).json({
          message: 'User already exists',
        });
      }

      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({
        email,
        password: hash,
        firstName,
        lastName,
      }).then((created) => {

        // Generate token
        const token = jwt.sign({ _id: created._id }, jwtSecret, {
          expiresIn: '24h',
        });

        return res.status(200).json({
          message: 'User created successfully', token
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get('/api/protect', passport.authenticate('jwt'), (req, res) => {
  res.send({ message: 'protected route' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
