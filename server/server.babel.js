var express = require('express');

const app = express();
const User = require('../db/models/User');
const Garden = require('../db/models/Garden')
const Plant = require('../db/models/Plant')
const Forum = require('../db/models/Forum')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'true'}));

app.use('/', express.static('public'));

mongoose.connect('mongodb://test:test@ds015750.mlab.com:15750/plantrdb', function(err) {
  if(err) {
    console.log('connection error', err);
  }
  else {
    console.log('connection with database successful');
  }
});

// db = mongoose.connection;


/*--------------------GET REQUEST---------------------------------------------*/
app.get('/api/users', function(req, res, next) {
  User.find({}, (err, data) => {
    if (err) {
      console.error(err);
    }
    res.status(200).send(data);
    next();
  })
});


// axios.get('/api/users')
//   .then( (response) => {
//     console.log("in response", response.data)
//   })

app.get('/api/gardens', function(req, res, next) {
  console.log("Server side: ", req);
  Garden.find({}, (err, data) => {
    if (err) {
      console.error(err);
    }
    res.status(200).send(data);
    next();
  })
});

app.get('/api/plants', function(req, res, next) {
  Plant.find({}, (err, data) => {
    if (err) {
      console.error(err);
    }
    res.status(200).send(data);
    next();
  })
});

app.get('/api/forum', function(req, res, next) {
  let email = req.query
  Forum.find({}, (err, data) => {
    if (err) {
      console.error(err);
    }
    res.status(200).send(data);
    next();
  })
});

app.get('/api/forum/:email', function(req, res, next) {
  Forum.find({}, (err, data) => {
    if (err) {
      console.error(err);
    }
    res.status(200).send(data);
    next();
  })
});

/*--------------------POST REQUEST---------------------------------------------*/

app.post('/api/users', (req, res, next) => {
  console.log("Inside api/users");
  let user = new User({
    userId: req.body.userId,
    username: req.body.username,
    email: req.body.email,
    gardens: req.body.gardens,
    profilePhoto: req.body.profilePhoto,
    coverPhoto: req.body.coverPhoto
  });
  user.save({}, (err)=> {
    if (err) {
      console.error(err);
    }
    res.send(200, 'Saved to the DB');
  });
});

app.post('/api/gardens', (req, res, next) => {
  console.log("In /api/gardens server side")
  let garden = new Garden({
    gardenId: req.body.gardenId,
    plantId: req.body.plantId,
    gardenGrid: req.body.gardenGrid,
    plantGrid: req.body.plantGrid
  });
  garden.save({}, (err)=> {
    if (err) {
      console.error(err);
    }
    res.send(200);
  });
});

app.post('/api/plants', (req, res, next) => {
  let plant = new Plant({
    plantId: req.body.plantId,
    image: req.body.image
  });
  plant.save({}, (err)=> {
    if (err) {
      console.error(err);
    }
    res.send(200);
  });
});

app.post('/api/forum', (req, res, next) => {
  let forum = new Forum({
    // category: req.body.category,
    // subjectLine: req.body.subjectLine,
    // message: req.body.message,
    // tags: req.body.tags,
    // region: req.body.region,
    // replies: req.body.replies,
    // voteCount: req.body.voteCount,
    // userId: req.body.userId,
    profile: req.body.profile,
    title: req.body.title,
    message: req.body.message,
    nickname: req.body.nickname,
    email: req.body.email,
    replies: req.body.replies
  });
  forum.save({}, (err)=> {
    if (err) {
      console.error(err);
    }
    res.send(200, 'Posted to Forum');
  });
});


/*--------------------PUT REQUEST-----------------------------------------*/
app.put('/api/forum', (req, res, next) => {
  Forum.findById(req.body.id, function(err, searchResult) {
      if (err) {
        console.log('error')
      } else {
        searchResult.replies.push(req.body.replies);
        searchResult.save(function(err) {
        if (err) {
          console.error('error');
        }
        else {
          res.send(200, searchResult);
          console.log(searchResult);
        }
      });
    }
  });
});
  //delete a snippet by id
  app.delete('/api/snippets/:id', snippetsController.delete);

/*--------------------DELETE REQUEST-----------------------------------------*/

app.delete('/api/forum/:email', function(req, res, next) {
  //   Forum.find({}, (err, data) => {
  //   if (err) {
  //     console.error(err);
  //   }
  //   res.status(200).send(data);
  //   next();
  // })
  //       db.Snippet.destroy({where: { id: Number(req.params.id)}})
  //     .then(function(res) {
  //       res.status(200).send('Snippet deleted successfully');
  //     })
  //     .catch(function(err) {
  //       res.status(400).send(err);
  //     });
  //         router.get('/deleteuser/:id', function(req, res) {

    var db = req.db;

    var uid = req.params.id.toString();
    var collection = db.get('usercollection');

    collection.remove({"_id":uid}, function(err, result) {
        res.send( (result === 1) ? { msg: 'Deleted' } : { msg: 'error: '+ err } );
    });

});
  // Todo.findOne({_id: req.params.id}).exec(function (err, item) {
  //   if (err || !item) {
  //     console.log('error finding record to delete', err);
  //     return next(new Error(err));
  //   }
  //   item.remove(function (err, success, next) {
  //     if (err) return next(err);
  //     console.log('deleted successfully', item);
  //     res.send('deleted successfully');
  //   });
  // });
});

app.use(function(err, req, res, next){
  console.log('Something failed');
  res.status(500).send({"Error" : err.message})
});

app.listen(process.env.PORT || 3000);