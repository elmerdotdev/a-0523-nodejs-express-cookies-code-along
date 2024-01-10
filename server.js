const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const PORT = 3002

// User database
const users = {
  'admin': 'admin12345',
  'guest': 'guest12345'
}

// Secret Key
const secretKey = 'vihori3ljvk09nlkc2wwgr1z'

// Parse cookies object
app.use(cookieParser(secretKey))

// Set view engine to ejs
app.set('view engine', 'ejs')

// Set static files folder
app.use(express.static('public'))

// Parse form submission
app.use(express.urlencoded({ extended: true }))

// Route to homepage
app.get('/', (req, res) => {
  if (req.cookies && req.cookies.userCookie) {
    res.render('index', { pageTitle: 'Home', user: req.cookies.userCookie })
  } else {
    res.redirect('/login')
  }
})

// Route to contact
app.get('/contact', (req, res) => {
  res.render('contact', { pageTitle: 'Contact' })
})

// Route to login
app.get('/login', (req, res) => {
  const { error, logout } = req.query
  if (req.cookies && req.cookies.userCookie) {
    res.redirect('/')
  } else {
    res.render('login', { pageTitle: 'Login', error, logout })
  }
})

// Route to post request
app.post('/login', (req, res) => {
  if (req.cookies && req.cookies.userCookie) {
    res.redirect('/')
  } else {
    const { username, password } = req.body
    if (users[username] && users[username] === password) {
      // Logged in successfully
      res.cookie('userCookie', username, {
        httpOnly: true,
        maxAge: 60000
      }) // 60 seconds
      res.redirect('/')
    } else {
      // Failed login
      res.redirect('/login?error=1')
    }
  }
})

// Route to log out
app.get('/logout', (req, res) => {
  res.clearCookie('userCookie')
  res.redirect('/login?logout=success')
})

// Route to set cookies
app.get('/set-cookies', (req, res) => {
  res.cookie('firstCookie', 'Hello world!', { httpOnly: true })
  res.cookie('persistentCookie', 'Hi world!', { maxAge: 60000, httpOnly: true }) // 60 seconds
  res.send('Cookie set!')
})

// Route to delete cookies
app.get('/clear-cookies', (req, res) => {
  res.clearCookie('firstCookie')
  res.send('Cookie deleted!')
})

// Route to get cookies
app.get('/get-cookies', (req, res) => {
  if (req.cookies && req.cookies.firstCookie) {
    res.send(req.cookies.firstCookie)
  } else {
    res.send('no cookie')
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})