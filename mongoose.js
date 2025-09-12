
  const mongoose =  require('mongoose')

                   require('dotenv').config()

 const connexion =   mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
 } )
  .then(() => console.log('connexion réussie á la base de données'))
  .catch(() => console.log('connexion impossible á la base de données '))

   module.exports =  connexion