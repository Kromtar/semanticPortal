const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const forEach = require('async-foreach').forEach;

const Experiment = mongoose.model('experiments');
const ExpA_Tests = mongoose.model('exp_a_tests');
const ExpA_Dictionary = mongoose.model('exp_a_dictionary');
const ExpA_Rounds = mongoose.model('exp_a_rounds');
const ExpA_Relation = mongoose.model('exp_a_relation');

//TODO: Falta crear las collection para las pausas

//Carga el test de un usuario, sino existe crea el test
async function loadUserTest(req, res) {
  try{
    const test = await ExpA_Tests.findOne(
      { _user: req.user.id, _experiment: req.body.experimentId, active: true },
      { _id: 1 }
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
  try {
    await ExpA_Dictionary.findOne({'readers.testId': req.body.testId, 'readers.asked': false},{word: 1}).sort({'readers.date': 1}).exec(function(err, word){
      //TODO: remover corchetes
      res.status(200).send({word});
    });
  } catch(err){
    res.status(404).send(err);
  }
}

//Crea un nuevo round y lo agrega al test
async function initRound(req, res) {
  try{
    const round = new ExpA_Rounds({
      word: req.body.word,
      date: new Date(req.body.time)
    });
    const newRound = await round.save();
    const testUpdated = await ExpA_Tests.findByIdAndUpdate(req.body.testId,{ $push: { _rounds: newRound._id} });
    res.status(200).send(newRound._id);
  }catch(err){
    res.status(404).send(err);
  }
}

//Añade las palabras escritas a una round
async function addWordToRelation(req, res) {
  try{
    forEach(req.body.wordList, async (item) => {
      await ExpA_Rounds.update(
          { _id: req.body.roundId },
          { $push: { relation: {word: item.word, date: new Date(item.time)} }}
      );
    });
    res.status(200).send({});
  }catch(err){
    res.status(404).send(err);
  }
}

//Termina un round
//TODO: Optimizar
async function endRound(req, res) {
  try{
    await ExpA_Rounds.update(
        { _id: req.body.roundId },
        {
          $set: { finalized: true}
        }
    );
    const allWordFromRound = await ExpA_Rounds.findOne(
      { _id: req.body.roundId },
      { relation: 1 }
    );
    //Por cada palabra agregada en el round se ve si esta en el diccionario y se registra el test
    forEach(allWordFromRound.relation, async (item) => {
      //Buscar si la palabra esta creada
      const wordSearch = await ExpA_Dictionary.findOne(
        { word: item.word }
      );
      if(wordSearch){
        //Si existe hay que ver si el test ya esta en la relacion
        const wordSearchTest = await ExpA_Dictionary.findOne(
          { _id: wordSearch._id,  'readers.testId': req.body.testId}
        );
        //si no esta en la relacion
        if(!wordSearchTest){
          await ExpA_Dictionary.update(
              { _id: wordSearch._id },
              { $push: { readers: {testId: req.body.testId} } }
          );
        }
      }else{
        //Si NO existe la palabra agregar palabra y registro de test
        const word = new ExpA_Dictionary({
          word: item.word,
          readers:[{
            testId: req.body.testId,
          }]
        });
        const newWord = await word.save();
      }
    });
    //marca como lista la palabra mencionada del diccionario
    await ExpA_Dictionary.update(
        { _id: req.body.mainWordId, 'readers.testId': req.body.testId },
        { $set: {'readers.$.asked': true}}
    );
    res.status(200).send({});
  }catch(err){
    res.status(404).send(err);
  }
}

module.exports = {
  loadUserTest,
  loadNextWord,
  initRound,
  addWordToRelation,
  endRound
};
