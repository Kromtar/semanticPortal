const mongoose = require('mongoose');

const Experiments = mongoose.model('experiments');

//TODO: Se podria dejar la id el experimento y posteriormente la del test al token.

async function loadRoom(req, res) {
  try{
    const experiment = await Experiments.findOne(
      { roomNumber: req.body.room, active: true },
      { expPublicId: 1, parameters: 1 }
    );
    if(experiment){
      res.status(200).send(experiment);
    }else{
      res.status(404).send({});
    }
  } catch(err){
    res.status(404).send(err);
  }
}

module.exports = {
  loadRoom
};
