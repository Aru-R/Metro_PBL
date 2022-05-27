const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()



router.post('/register', async (req, res) => {
    console.log(req.body)
    const {fullname, email, passkey, contactno } = req.body
    const user = new User({name: fullname, email, password: passkey, mobilePhone: contactno})
    try {
        await user.save()
        console.log('check-1')
        const token = await user.generateAuthToken()
        req.session.token = token
        console.log('check-2')
        res.redirect('/')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, passkey: password} = req.body
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        console.log("user",user)
        console.log("user token",token)
        req.session.token = token
        res.redirect('/')
    } catch (e) {
        req.flash('error', 'Invalid credentials')
        res.redirect('/loginerror')
    }
})

router.get('/logout', auth, async (req, res) => {
    console.log("before tokens:",req.user.tokens)
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        console.log("after tokens:",req.user.tokens)
        req.session.destroy()
        await req.user.save()
        res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/register', async (req, res) => {
    res.render('register')
})

router.get('/login', async (req, res) => {
    res.render('login')
})






// router.patch('/users/me', auth, async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         updates.forEach((update) => req.user[update] = req.body[update])
//         await req.user.save()
//         res.send(req.user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.delete('/users/me', auth, async (req, res) => {
//     try {
//         await req.user.remove()
//         res.send(req.user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router