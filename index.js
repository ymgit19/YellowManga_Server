const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/Yell')
    .then(() => {
        console.log("Databases has been connected");
    })
    .catch(() => {
        console.log("Databases not connected");
    })

const UserSchema = new mongoose.Schema({
    fname: { type: String },
    lname: { type: String },
    email: { type: String, require: true },
    password: { type: String, require: true },
})
const addressSchema = new mongoose.Schema({
    fname: { type: String },
    lname: { type: String, require: true },
    address: { type: String, require: true },
    address2: { type: String },
    city: { type: String, require: true },
    state: { type: String, require: true },
    zipCode: { type: Number, require: true },
    country: { type: String, require: true },
})
const cardSchema = new mongoose.Schema({
    name: { type: String },
    cardNumber: { type: String, require: true },
    cvv: { type: Number, require: true },
    expirationDate: { type: String, require: true },
})

const Collection = mongoose.model('yellowblogs', UserSchema)
const AdressDetails = mongoose.model('adressDetails', addressSchema)
const payCollection = mongoose.model('payments', cardSchema);
app.use(express.json());
app.use(cors());
app.post('/posting', async (req, resp) => {
    try {
        const user = new Collection(req.body);
        const result = await user.save();
        const dataSending = result.toObject();
        resp.send(dataSending);
    }
    catch (e) {
        console.log(e);
    }
})

app.post('/address', async (req, resp) => {
    try {
        const user = new AdressDetails(req.body);
        const result = await user.save();
        const dataSending = result.toObject();
        resp.send(dataSending);
    }
    catch (e) {
        console.log(e);
    }
})
app.post('/cardetails', async (req, resp) => {
    try {
        const user = new payCollection(req.body);
        const result = await user.save();
        const dataSending = result.toObject();
        resp.send(dataSending);
    }
    catch (e) {
        console.log(e);
    }
})

app.get('/datas', async (req, resp) => {
    try {
        const users = await payCollection.find({}, 'name cardNumber expirationDate'); // Remove commas between field names
        resp.json(users);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to retrieve user data');
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Collection.findOne({ email, password });
        if (user) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {

            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
});


app.listen(port, () => {
    console.log(`App is listening to ${port}`);
})