import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

app.use(express.json());

import User from "./models/user.model.js";

let refereshTokens = [];

function generateAcessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}

const token = async(req, res) => {
    const refereshToken = req.body.token

    if(refereshToken == null) return res.sendStatus(401);
    if(!refereshToken.includes(refereshToken)) return res.sendStatus(403)

    jwt.verify(refershToken, process.env.REFERESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        const accessToken = generateAcessToken({ name: user.name })
        res.json({ accessToken: accessToken });
    })
}

const logout = async(req, res) => {
    refereshTokens = refereshTokens.filter(token => token != req.body.token)
    res.sendStatus(204)
}

const Login = async(req, res) => {
    const user = users.find(user => user.name === req.body.username);

    if(user == null) {
        return res.status(400).send('cannot find user!');
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('success');
        } else {
            res.send('not allowed');
        }
    } catch {
        res.status(500).send('error during login')
    }

    const username = user.name;
    const token_user = { name: username };

    const accessToken = generateAccessToken(token_user);
    const refereshToken = jwt.sign(token_user, process.env.REFERESH_TOKEN_SECRET);

    refereshTokens.push(refereshToken)
    res.json({ accessToken: accessToken, refereshToken: refereshToken})
}

const register = async(req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ name: username});
    if (existingUser) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name: username,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
}