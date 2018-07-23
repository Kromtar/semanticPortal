//TODO: Borrar en produccion
exports.auth = function (req, res, next) {
  if(req.body.key === process.env.PASSWORDCHANGE ){
    console.log("Auth cambio pass");
  }else{
    return res.status(404).send("ERR");
  }
  next();
};
