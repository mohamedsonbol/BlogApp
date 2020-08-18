require('dotenv').config();

var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express(),
Blog           = require('./models/blog'),
port           = process.env.PORT || 3000,
connectDB       = process.env.DATABASEURL || "mongodb://localhost/restful_blog_app"


// APP CONFIG
mongoose.connect(connectDB,
{   useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to DB!');
}).catch(err => {
    console.log("ERROR!:", err.message);
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// RESTFUL ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs');
})

// INDEX ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) {
            console.log('Error!');
        } else {
            res.render('index', {blogs: blogs});
        }
    })
})

// CREATE ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new')
});

app.post('/blogs', (req, res) => {
    // Create Blog
    console.log(req.body);
    console.log("===========")
    console.log(req.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err) {
            res.render('new');
        } else {
            console.log(newBlog);
            res.redirect('/blogs');
        }
    })
});

// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog})
        }
    })
});

// UPDATE ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    })
});

app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    })
});

// DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, deleteBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            console.log("Blog Delted Successfully!");
            res.render('deleted');
        }
    })
})

// LISTINING ON PORT
app.listen(port, process.env.IP, () => {
    console.log(`Listining on ${port}`);
})