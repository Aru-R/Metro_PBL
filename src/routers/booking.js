const express = require('express')
const Pass = require('../models/booking')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router()


router.post('/bookpass', auth, async (req, res) => {
    const pass_type = 'Daily Pass'
    const { dayPass: purchase_date} = req.body
    console.log(pass_type, purchase_date)
    const booking = new Pass({
        pass_type,
        purchase_date,
        owner: req.user._id
    })

    try {
        await booking.save()
        res.redirect('/')
    } catch (e) {
        res.redirect('/error')
    }
})

router.get('/showpass', async (req, res) => {
    try {
        res.render('book_pass')
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/getuserpass', auth, async (req, res) => {
    try {
        const user = await req.user.populate('passes')
        const booking = {
            owner: user.name,
            passes: user.passes,
        }
        res.render('show_pass', { booking })
        console.dir(user)
    } catch (e) {
        res.redirect('/error')
    }
})

// router.get('/tasks/:id', auth, async (req, res) => {
//     const _id = req.params.id

//     try {
//         const task = await Task.findOne({ _id, owner: req.user._id })

//         if (!task) {
//             return res.status(404).send()
//         }

//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.patch('/tasks/:id', auth, async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

//         if (!task) {
//             return res.status(404).send()
//         }

//         updates.forEach((update) => task[update] = req.body[update])
//         await task.save()
//         res.send(task)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.delete('/tasks/:id', auth, async (req, res) => {
//     try {
//         const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

//         if (!task) {
//             res.status(404).send()
//         }

//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router