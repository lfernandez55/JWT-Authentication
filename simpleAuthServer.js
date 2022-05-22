require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())


const posts = [
    {
        username: 'Kyle',
        title: 'Post 1'
    },
    {
        username: 'Jim',
        title: 'Post 2'
    }
]



app.get('/posts', authenticateToken, (req, res) => {
    console.log("in posts route.....")
    res.json(posts)
})

//Authenticate User
app.post('/login', (req, res) => {
    const username = req.body.username
    const user = { name: username }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
})



function authenticateToken(req, res, next) {
    console.log('in authenticateToken')
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    console.log('Debug 0')
    if (token == null) return res.sendStatus(401)
    console.log("Debug 1")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log('Debug 2')
        if (err) return res.sendStatus(403)
        req.user = user
        console.log(user)
        next()
    })
}

app.listen(2000)