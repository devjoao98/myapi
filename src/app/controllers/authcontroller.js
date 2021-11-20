const express = require('express')
const User = require('../models/user')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')
const buildHtml = require('../../utils/build-html')

const compile = buildHtml({
    base_path: __dirname + '/../../views/'
})

function generateToken(params = {}) {
    return jwt.sign( params, authConfig.secret, {
    expiresIn: 86400,
    });
};

router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if (await User.findOne( { email }))
            return res.status(400).send({ error: 'User already exists' });

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({ id: user.id}),
        });
    } catch(err){
        console.error(err)
        return res.status(400).send( {error: 'Registration faild' });
    }
});

router.post('/authenticate', async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ error: 'User not found' });

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password'});

    user.password = undefined;


    res.send({ 
        user, 
        token: generateToken({ id: user.id}),
    });
});

router.post('/forgot_password', async(req, res) => {
    
    const { email } = req.body;

    try{
        const user = await User.findOne( { email } )

            if(!user)
                return res.status(400).send({ error: 'User not found'})

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)


        await User.findByIdAndUpdate(user.id, {
            '$set': { 
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        })

        const templateHtml = compile('forgot_password.html', { token })

        await mailer.sendMail({ 
            to: email,
            from: 'pheu2016@gmail.com',
            html: templateHtml
        })

        
        res.status(200).json()
    } catch(err) {
        console.error(err)
        return res.status(400).send({err: 'Error on forgot password, try again'})
    }
    
    
    

})

module.exports = app => app.use('/auth', router);