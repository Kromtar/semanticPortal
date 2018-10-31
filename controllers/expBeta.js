const _ = require('underscore');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const Experiment = mongoose.model('experiments');
const ExpB_Tests = mongoose.model('exp_b_tests');
const ExpB_words_list = mongoose.model('exp_b_words_list');
const ExpB_RelationNodes = mongoose.model('exp_b_relation_nodes');

async function loadUserTestBeta(req, res) {
  try {
    const test = await ExpB_Tests.findOne(
      { _user: req.user.id, _experimentBetaId: req.body.experimentId, active: true },
      { _id: 1 }
    );
    if(test){
      //El test existe
      res.status(200).send(test);
    } else {
      //El test no existe
      //Creamos el nuevo test beta con la informacion del user, expetimento beta y experimento alpha
      const test = new ExpB_Tests({
        _user: req.user.id,
        _experimentBetaId: req.body.experimentId, //cambiar nombre y aclarar que es la id del experimento beta
      });
      const newTest = await test.save();
      res.status(200).send(newTest);
    }
  } catch (err) {
    res.status(404).send(err);
  }

}

async function loadExpBetaWords(req, res){
  try {
    //Busca la lista de palabras de la persona
    const wordsList = await ExpB_words_list.findOne(
      { _user: req.user.id,  _alphaExpSource: req.body.alphaExpSource, roomBetaNumber: req.body.roomBetaNumber }
    );
    if(wordsList){
      //Filtra por las no preguntadas aun
      var wordsListNotAsked = wordsList.wordsAssociates.filter((element) => {
        return element.asked === false;
      });
      //Verifica que existan suficientes palabras para el experimento
      if(wordsListNotAsked.length < 2){
        res.status(404).send({err: 'outOfWords'});
      }else{
        //Toma 2 palabras aleatoreas
        var randomWords = _.sample(wordsListNotAsked, 2);
        res.status(200).send(randomWords);
      }
    } else {
      res.status(404).send({err: 'wordsList not fund'});
    }
  } catch (err) {
    res.status(404).send(err);
  }
}

//Guarda una nueva asociacion de palabras
async function saveWordsRelations(req, res){
  try {
    //construir la secuencia
    var sequence = [];
    for(var relationIndex = 0; relationIndex < req.body.relations.length; relationIndex++){
      sequence.push({
        wordA: req.body.relations[relationIndex].wordFrom,
        wordB: req.body.relations[relationIndex].wordTo,
        conectionType: req.body.relations[relationIndex].relation,
      });
    }

    //Guardamos el nuevo nodo
    const relationNode = new ExpB_RelationNodes({
      testId: req.body.testId,
      wordA: req.body.relations[0].wordFrom,
      wordB: req.body.relations[req.body.relations.length - 1].wordTo,
      sequence: sequence
    });
    const newRelationNode = await relationNode.save();


    //Marcar palabras ya preguntadas

    await ExpB_words_list.update(
      {
        _user: req.user.id,
        roomBetaNumber: req.body.roomBetaNumber,
        'wordsAssociates.word': req.body.relations[0].wordFrom
      },
      {
        $set: { 'wordsAssociates.$.asked': true}
      }
    );

    await ExpB_words_list.update(
      {
        _user: req.user.id,
        roomBetaNumber: req.body.roomBetaNumber,
        'wordsAssociates.word': req.body.relations[req.body.relations.length - 1].wordTo
      },
      {
        $set: { 'wordsAssociates.$.asked': true}
      }
    );

    //guardar la sequencia
    res.status(200).send({});
  } catch (err) {
    res.status(404).send(err);
  }
}

module.exports = {
  loadUserTestBeta,
  loadExpBetaWords,
  saveWordsRelations
};
