const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const forEach = require('async-foreach').forEach;

const Experiment = mongoose.model('experiments');
const ExpA_Tests = mongoose.model('exp_a_tests');
const ExpA_Dictionary = mongoose.model('exp_a_dictionary');


//Carga el test de un usuario, sino existe crea el test
async function loadUserTest(req, res) {
  try{
    const test = await ExpA_Tests.findOne(
      { _user: req.user.id, _experiment: req.body.experimentId, active: true }
    );
    if(test){
      res.status(200).send(test);
    }else{
      //Se crea el test
      const test = new ExpA_Tests({
        _user: req.user.id,
        _experiment: req.body.experimentId,
      });
      const newTest = await test.save();
      //Se carga el pool inicial
        const exp = await Experiment.findOne(
          {_id: req.body.experimentId}
        );
        forEach(exp.parameters.initialpool, async (item) => {
          //Buscar si la palabra esta creada
          const wordSearch = await ExpA_Dictionary.findOne(
            { word: item }
          );
          if(wordSearch){
            //Si existe agregar el registro de testId
            await ExpA_Dictionary.update(
                { _id: wordSearch._id },
                { $push: { readers: {testId: newTest._id} } }
            );
          }else{
            //Si NO existe la palabra agregar palabra y registro de test
            const word = new ExpA_Dictionary({
              word: item,
              readers:[{
                testId: newTest._id,
              }]
            });
            const newWord = await word.save();
          }
        });
      res.status(200).send({_id: newTest._id});
    }
  } catch(err){
    res.status(404).send(err);
  }
}

//Busca la proxima palabra a mostrar al usuario
async function loadNextWord(req, res) {
  console.log(req.body.testId);
  try {

    await ExpA_Dictionary.findOne({'readers.testId': req.body.testId, 'readers.asked': false}).sort({'readers.date': 1}).exec(function(err, word){
      res.status(200).send({word});
    });
    
  } catch(err){
    res.status(404).send(err);
  }
}

module.exports = {
  loadUserTest,
  loadNextWord
};
