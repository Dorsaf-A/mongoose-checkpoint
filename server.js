// 0-Install and setup mongoose
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Person = require('./model/person');

var port = 5000;

//1-Connexion to Database
mongoose.connect('mongodb://localhost/PersonList', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('DB connected!')
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.send('Happy to be here !');
});
//3-Create and Save a Record of a Model
app.post('/person', function(req, res) {
    
    var person1 = new Person();
    person1.name='mohamed';
    person1.age=37;
    person1.favoriteFoods=["pizza","cake","smoothy"];

    person1.save(function(err, person) {
        if(err) {
            res.send('error saving person');
        } else {
            console.log(person);
            res.send(person);
        }
    });
});

//4-Create Many Records with model.create()
app.post('/person2', function(req, res) {
    var PersonList= [
        {
            name: "wassim",
            age: 27,
            favoriteFoods:['Legumes','eggs','soda']
        },
        {
            name: "oussema",
            age: 18,
            favoriteFoods:['Meat','chocolat','ice-cream']
        },
        {
            name: "Amal",
            age: 13,
            favoriteFoods:['French Fries','Burger','Muffins']
        }
    ];
    Person.create(PersonList, function(err, person) {
        if(err) {
        res.send('error saving person');
        } else {
        console.log(person);
        res.send(person);
    }
    });
});

//5-Use model.find() to Search Your Database(By name)
app.get('/persons/:name', function(req, res) {
    console.log(`getting all persons having name : ${req.params.name}`);
    Person.find({
        name: req.params.name
        })
    .exec(function(err, persons) {
        if(err) {
            res.send('error occured')
        } else {
            console.log(persons);
            res.json(persons);
        }
    });
});

//6-Use model.findOne() to Return a Single Matching Document from Your Database
app.get('/persons/favorite/:food', function(req, res) {
    console.log(`getting one person liking : ${req.params.food}`);
    Person.findOne({
        favoriteFoods: req.params.food
        })
    .exec(function(err, persons) {
        if(err) {
            res.send('error occured')
        } else {
            console.log(persons);
            res.json(persons);
        }
    });
});

//7-Use model.findById() to Search Your Database By _id
app.get('/persons/id/:id', function(req, res) {
    console.log(`getting person by ID : ${req.params.id}`);
    Person.findById(
        req.params.id
        )
    .exec(function(err, persons) {
        if(err) {
            res.send('error occured')
        } else {
            console.log(persons);
            res.json(persons);
        }
    });
});

//8-Perform Classic Updates by Running Find, Edit, then Save
app.get('/persons/id/:id/:addFood', function(req, res) {
    console.log(`getting person by ID : ${req.params.id}`);
    Person.findById(
        req.params.id
        )
    .exec(function(err, persons) {
        if(err) {
            res.send('error occured')
        } else {
            persons.favoriteFoods.push(req.params.addFood);
            res.json(persons);
        }
    });
});

//9-Perform New Updates on a Document Using model.findOneAndUpdate()
app.put('/person/:name', function(req, res) {
    Person.findOneAndUpdate({
        name: req.params.name
        },
        { $set: { age: 20 }
    }, {new: true}, function(err, newperson) {
        if (err) {
        res.send('error updating ');
        } else {
        console.log(newperson);
        res.send(newperson);
        }
    });
});

//10-Delete One Document Using model.findByIdAndRemove
app.delete('/deleteperson/:id', function(req, res) {
    Person.findOneAndRemove({
        _id: req.params.id
    }, function(err, personRemoved) {
        if(err) {
        res.send('error removing')
        } else {
        console.log("successfully deleted" + personRemoved);
        res.send('Removed')   
    }
    });
});

//11-Delete Many Documents with model.remove()
app.delete('/remove', function(req, res) {
    Person.remove({
        name: "Mary"
    }, function(err, personsRemoved) {
        if(err) {
        res.send('error removing')
        } else {
        console.log("successfully deleted");
        res.send(personsRemoved)
    }
    });
});

//12-Chain Search Query Helpers to Narrow Search Results
app.get('/select', function(req, res) {
    Person.find({
        favoriteFoods: "burrito"
    }).select(['name','favoriteFoods']).sort({'name':1}).limit(2)
    .exec(function(err, persons) {
        if(err) {
            res.send('error occured')
        } else {
            console.log(persons)
            res.json(persons);
        }
    });
});


//Server Configuration
app.listen(port, () => {
    console.log(`Serever is running on ${port}`)
})