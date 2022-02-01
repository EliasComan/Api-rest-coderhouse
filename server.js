const express = require('express')
const BodyParser = require('body-parser')
const morgan = require('morgan')
const multer = require('multer')
const app = express()
const PORT = 8080
const Contenedor = require('./Ej2.js')
const objContenedor = new Contenedor();
const router = express.Router()


//MIDDLEWARES
app.use(morgan('tiny'))
app.use(express.static('public'))
app.use(express.json())
app.use(BodyParser.urlencoded({extended : true}))
app.use('/api/productos', router)

//STORAGE
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads')
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+ file.originalname)
    }
})
const upload = multer({storage: storage})

router.get('/', (req, res) => { 
    const data =   objContenedor.getAll()
    const nombres =  data.map(i => i.title)
    res.send(nombres)
    
    
})
router.get('/productoRandom',  (req, res)  => {
    const num = () =>{
        let num = Math.floor(Math.random()*10)
        if (num === 0) {
            return num+1
        }else{
            return num
        }
    } 
    res.send( objContenedor.getByid(num()))
})

router.get('/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const producto = objContenedor.getByid(id)
    res.send( producto )
})

router.post('/',upload.single('thumnbail'), ( req, res, next) => {
    const data =   objContenedor.getAll()
    const lastId = data[data.length-1].id;
    const file = req.file
   if (!file) {
       const error = new Error('Please upload a file')
       error.httpStatusCode=400;
       return next(error)
   } else {
       
       let newData = {
           title: req.body.title ,
           price: req.body.price,
           thumnbail:req.file,
           id:lastId +1
           
       }
       objContenedor.save(newData)
       res.status(200).json({data: newData})
   }
})

router.put('/:id',(req, res ) => {
    let newData = {
        title: req.body.title ,
        price: req.body.price,
        thumnbail:req.body.thumnbail,
        id:req.params.id

    }
    res.status(200).json(objContenedor.replaceById(parseInt(req.params.id),newData))
})

router.delete('/:id', (req, res) => {
    res.status(200).json(objContenedor.deleteById(parseInt(req.params.id)))
})


const server = app.listen(PORT, () => {
    console.log('Escuchando en el puerto' + PORT);
})

server.on('err', (error) => {
    console.log(error)
})