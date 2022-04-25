const express = require('express');
const mongoose = require('mongoose')
const multer  = require('multer');

const Product = require('./models/product')

mongoose.connect('mongodb://127.0.0.1:27017/fakestoreapi_db');

const app = express();

app.use(express.json());

app.use(express.static('uploads'));

app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({ destination: 'uploads', filename: (req, file, cb) => {
    cb(null, `${file.originalname}`)
}})

const upload = multer({ storage: storage })

app.get('/', (req, res) => {
    res.send('Welcome to Fakestoreapi replica');
})

// GET /products
app.get('/products', async(req, res) => {
    const Products = await Product.find()
    res.json(Products);
})

// GET /products/:id
app.get('/productsbyname', async (req, res) => {
    const name = req.query.name;
    const Products = await Product.find({ name: name });

    res.json(Products);
})

// GET /products by name
app.get('/productsbyname', async (req, res) => {
    const name = req.query.name;
    const Products = await Product.find({ name: name});

    res.json(Products)
})

// POST /product
// app.post('/products', async (req, res) => {
//     const product = new Product(req.body);

//     await product.save();

//     res.json(product);
// })

app.post('/products/photo', upload.single('image'), async (req, res) => {
    console.log(req.file);
    const filepath = `${req.file.originalname}`

    const product = new Product({...req.body, image: filepath});

    await product.save();

    res.json(product);
})

// PATCH /product
app.patch('/products/:id', async (req, res) => {
    const _id = req.params.id;

    const Product = await Product.findByIdAndUpdate(_id. req.body);

    res.json(Product);
})

// DELETE /product/:id
app.delete('/products/:id', async (req, res) => {
    const _id = req.params.id;

    const Product = await Product.findByIdAndRemove(_id);

    res.json(Product)
})

app.listen(3003, () => console.log('Server running on port 3003'));