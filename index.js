import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserControllers from './controlers/UserControllers.js';
import * as PostControllers from './controlers/PostControllers.js';
import multer from 'multer';


mongoose.connect('mongodb+srv://admin:Leuta17042003@cluster0.tcyyrig.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => {
		console.log('DB ok');
	})
	.catch((err) => {
		console.log('DB error', err);
	})


const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.use(express.json());

app.post('/auth/login', loginValidation, UserControllers.login);
app.post('/auth/register', registerValidation, UserControllers.register);
app.get('/auth/me', checkAuth, UserControllers.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});


app.get('/posts', PostControllers.getAll);
app.get('/posts/:id', PostControllers.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostControllers.create);
app.delete('/posts/:id', checkAuth, PostControllers.remove);
app.patch('/posts/:id', checkAuth, PostControllers.update);

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('Server OK');
});