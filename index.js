const express = require('express');

const app = express();
const port = 3000;
app.listen(port, () => console.log(`notes-app on port ${port}`));


const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection success');
    })
    .catch(err => {
        console.log('Error');
    })


const Note = sequelize.define('notes', {note: Sequelize.TEXT, tag: Sequelize.STRING});

sequelize.sync({force: true})
    .then(() => {
        console.log('Database and Tables Ready');

        Note.bulkCreate([
            { note: 'pick up some bread after work', tag: 'shopping' },
            { note: 'remember to write up meeting notes', tag: 'work' },
            { note: 'learn how to use node orm', tag: 'work' }
          ]).then(function() {
            return Note.findAll();
          }).then(function(notes) {
            console.log(notes);
          });
    });

app.get('/',(req,res) => res.send('Notes App'));

app.get('/notes', function(req, res) {
    Note.findAll().then(notes => res.json(notes));
  });