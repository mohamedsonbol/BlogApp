require('dotenv').config();

const methodOverride = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      mongoose = require('mongoose'),
      express = require('express'),
      app = express(),
      Blog = require('./models/blog'),
      port = process.env.PORT || 3000,
      connectDB = process.env.DATABASEURL || 'mongodb://localhost/restful_blog_app';

// APP CONFIG
mongoose.connect(connectDB)
.then(() => {
    console.log('Connected to DB!');
})
.catch(err => {
    console.log('ERROR!:', err.message);
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// RESTFUL ROUTES

// ROOT ROUTE
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.render('index', { blogs });
    } catch (err) {
        console.log('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
});

// CREATE ROUTE
app.post('/blogs', async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body.blog);
        console.log('New Blog Created:', newBlog);
        res.redirect('/blogs');
    } catch (err) {
        console.log('Error:', err);
        res.render('new');
    }
});

// SHOW ROUTE
app.get('/blogs/:id', async (req, res) => {
    try {
        const foundBlog = await Blog.findById(req.params.id);
        res.render('show', { blog: foundBlog });
    } catch (err) {
        console.log('Error:', err);
        res.redirect('/blogs');
    }
});

// EDIT ROUTE
app.get('/blogs/:id/edit', async (req, res) => {
    try {
        const foundBlog = await Blog.findById(req.params.id);
        res.render('edit', { blog: foundBlog });
    } catch (err) {
        console.log('Error:', err);
        res.redirect('/blogs');
    }
});

// UPDATE ROUTE
app.put('/blogs/:id', async (req, res) => {
    try {
        req.body.blog.body = req.sanitize(req.body.blog.body);
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body.blog, { new: true });
        res.redirect(`/blogs/${req.params.id}`);
    } catch (err) {
        console.log('Error:', err);
        res.redirect('/blogs');
    }
});

// DELETE ROUTE
app.delete('/blogs/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        console.log('Blog Deleted Successfully!');
        res.render('deleted');
    } catch (err) {
        console.log('Error:', err);
        res.redirect('/blogs');
    }
});

// LISTENING ON PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});