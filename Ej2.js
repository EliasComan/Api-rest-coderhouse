const fs =  require('fs');
const productos = './productos.txt'
const data = fs.readFileSync(productos,'utf-8')
const parseData = JSON.parse(data)
let id = parseData.map(i => i.id).pop();

class Contenedor {
    constructor (productos){
           this.productos = productos
    }

    save (object) { 
         const data = [...parseData, object]
         fs.promises.writeFile(productos,JSON.stringify(data,null,2))
                .then(console.log('Terminado'))
                .catch(err => {console.log(err)})

     }

   getByid ( id){ 
         const obj =  parseData.find( i => i.id === id)
        if (obj === undefined) {
            console.log('Proba con otro id');
        }
        else{
            return obj;

        }
     }
     getAll () {
         return parseData
     }
     
      deleteById(id){
         const newArray = parseData.filter(item => item.id != id)
         if (!newArray) {
            return {error: 'Producto no encontrado'}
         } else {
             fs.promises.writeFile(productos,JSON.stringify(newArray,null,2))
                    .then(console.log('Terminado'))
             return newArray
         }
         
     }
     replaceById(id,newData){
        console.log(id)
        const findItem = parseData.find(i => parseInt(id) === i.id)
        if (!findItem) {
           
            return {error: 'Producto no encontrado'}
        } else {
            const filterData = parseData.filter(i => parseInt(id) !== i.id)
            filterData.push(newData)
            filterData.sort(function (a, b) {
                if (a.id > b.id) {
                  return 1;
                }
                if (a.id < b.id) {
                  return -1;
                }
                return 0;
              })
            
            return filterData
            
        }
     }
     deleteAll () {
        const newArray = []
             fs.promises.writeFile(productos,JSON.stringify(newArray,null,2))
                .then(console.log('Terminado'))
                .catch(err =>{console.log(err)})
       
     }
}



module.exports = Contenedor;