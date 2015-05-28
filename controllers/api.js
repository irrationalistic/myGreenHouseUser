// var Garden = require('../models/garden.js');
var fs     = require('fs');
var apiController = {

  getAll: function(req, res){
    var requestedId = req.query._id;
    if(requestedId){
      //get one!
      res.send(req.user.gardens.id(requestedId));
    } else {
      res.send(req.user.gardens);
    }
  },

  addGarden: function(req, res){
    // var garden = new Garden(req.body);
    // garden.save(function(err, result){
    //   res.send(result);
    // });
    req.user.gardens.push(req.body);
    req.user.save(function(err, result){
      res.send(result);
    })
  },

  deleteGarden: function(req, res){
    
    // req.user.gardens.findByIdAndRemove(gardenId, function(err, results){
    //   res.send(results);
    // });
    // console.log('req.params', req.params.gardenId);
    // console.log('user gardens:', req.user.gardens);
    // console.log('req body:', req.body);

    var gardenId = req.params.gardenId;
    var gardens = req.user.gardens;
    for (var i = 0; i < gardens.length; i++) {
      if(gardenId == gardens[i]._id.valueOf()){
        console.log('gardenID: ', gardens[i]._id.valueOf(), gardenId);
        req.user.gardens.splice(i, 1);
        break
      }
    };
    req.user.save(function(err, result){
      res.send(result);
    })

  },

  deletePlant: function(req, res){
    var gardenId = req.params.gardenId;
     Garden.findByIdAndRemove(gardenId, function(err, results){
        res.send(results);
      });
  },

  checkLocation: function(req, res){
    var gardenId = req.body.id;
    var value   = req.body.value;
    console.log(value);
    Garden.findByIdAndUpdate(gardenId, {$set:{location: value}}, function(err, results){
      res.send(results);
    });
  },
  
  checkWater: function(req, res){
    var gardenId = req.body.id;
    var value   = req.body.value;
    console.log(value);
    Garden.findByIdAndUpdate(gardenId, {$set:{water: value}}, function(err, results){
      res.send(results);
    });
  },

  checkSunlight: function(req, res){
    var gardenId = req.body.id;
    var value   = req.body.value;
    console.log(value);
    Garden.findByIdAndUpdate(gardenId, {$set:{sunlight: value}}, function(err, results){
      res.send(results);
    });
  },

  checkSoil: function(req, res){
    var gardenId = req.body.id;
    var value   = req.body.value;
    console.log(value);
    Garden.findByIdAndUpdate(gardenId, {$set:{soil: value}}, function(err, results){
      res.send(results);
    });
  },

  checkTitle: function(req, res){
    var gardenId = req.body.id;
    var value   = req.body.value;
    Garden.findByIdAndUpdate(gardenId, {$set:{title: value}}, function(err, results){
      res.send(results);
    });
  },


  checkComment: function(req, res){
    var gardenId = req.body.id;
    var value   = req.body.value;
    Garden.findByIdAndUpdate(gardenId, {$set:{comment: value}}, function(err, results){
      res.send(results);
    });
  },

  addImg: function(req, res){
    var gardenId = req.params.gardenId;
    var data = req.body.img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFile('image.png', buf);
    Garden.findByIdAndUpdate(gardenId, {$set:{img: data}}, function(err, results){
      res.send(results);
    });
  },

  updateGarden: function(req, res){
    var gardenId = req.params.gardenId;
    Garden.findByIdAndUpdate(gardenId, req.body, {new: true}, function(err, results){
      res.send(results);
    });
  }

};

module.exports = apiController;