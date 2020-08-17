var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express(),
port           = process.env.PORT || 3000;

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app",
{   useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false}
);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

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
app.listen(port, () => {
    console.log(`Listining on ${port}`);
})