const http = require('http');
const path = require('path');

// Third party dependencies
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid');
const bodyParser = require('body-parser');

require('dotenv').config();


const db = monk(process.env.MONGODB_URI);
const urls = db.get('urls'); // Created a collection
urls.createIndex({ slug: 1 }, { unique: 1 });
// urls.createIndex({ name: 1}, { unique: true });  // Depending on db integrity

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


// Midddlewares
app.use(morgan('tiny')); // Logger
app.use(helmet()); // Minimal security
app.use(cors()); // Cross-Origin protection
// app.use(express.json()); // Json body parser
app.use(express.static(path.join(__dirname, './views'))); 
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.static(path.join(__dirname, './public'))); 


// Routes

app.get('/', (req, res, next) => {
    res.render('index', {
        path: 'index',
        pageTitle: 'rccUrlshortener'
    });
})
app.get('/:id', async (req, res, next) => {
    // TODO: redirect to url
    const id = req.params.id;
    try {
        const url = await urls.findOne({ id });
        if (url) {
            console.log(url.url + ' iono what this is ????');
            res.redirect(url.url)
        }
        res.redirect(`/?error=${slug} not found`);
    } catch (error) {
        res.redirect(`/?error=Link not found`);
    };
});


const schema = yup.object().shape({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().trim().url().required(), // yup will automate the url validation and we could pass in options such as httpOnly
})


app.post('/url', async (req, res, next) => {
    // TODO: create a short url
    // let { slug, url } = req.body;
    let url = req.body.url;
    let slug = req.body.slug;
    
    console.log(url + ' url');
    console.log(slug + ' slug');


    try {
        await schema.validate({
            slug,
            url
        });

        if (!slug) {
            slug = nanoid(5);
        } else {
            const existingSlug = await urls.findOne({ slug });

            if (existingSlug) {
                throw new Error ('Slug in use. ');
            };
        };

        slug = slug.toLowerCase();
        console.log(`${slug} slug variable`);

        const newUrl = {
            url,
            slug,
        };
        console.log(newUrl + 'new url');

        const created = await urls.insert(newUrl);
        res.json(created)
        // res.json({ slug, url });
    } catch (err) {
        next(err);
    }
});

app.get('/url/:id', (req, res) => {
    // TODO: get a short url by id and get information about your short url
});


// Error Handling
app.use((error, req, res, next) => {
    if (error.statusCode) {
        res.status(error.status);
    } else  {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'great' : error.stack
    })
});



const PORT = process.env.PORT || 1337;

app.listen(PORT, () => console.log(`App.js server running on ${PORT}`));