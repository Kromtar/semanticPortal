import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as actions from '../actions';
import Modal from 'react-responsive-modal';

//TODO: Se podria manejar la info de las forms con los states de la clase
//TODO: realizar despliegue y analisis de campos con un for y array
//TODO: Modularizar

class NewAccountModal extends Component {

  state = {
    nameInputClassName: 'validate',
    surnameInputClassName: 'validate',
    newRutInputClassName: 'validate',
    mailInputClassName: 'validate',
    ageInputClassName: 'validate',
    newPasswordInputClassName: 'validate',
    newPasswordVerInputClassName: 'validate',
  }

  componentDidMount() {
    this.initializeSelect();
  }

  componentDidUpdate() {
    console.log(this.props.formData);
    console.log(this.state);
  	this.initializeSelect();
  }

  initializeSelect() {
    $('#select').material_select();
  }

  onCloseModal(){
    //limpiar los formularios
    this.props.modalControl({modalId: 'newAccount', state: false});
  }

  onChangeInput(inputId){
    this.props.formInput({formId:'newAccount', inputId:inputId, text: $('#'+inputId).val()})
  }

  onChangeRadioButton(radioButtonId){
    this.props.formInput({formId:'newAccount', inputId:'gender', text: $('#'+radioButtonId).val()})
  }

  validateExistenceAndLength(formData, errStateVarName, maxLength, minLength){
    var trimedFormData = formData.trim();
    if(trimedFormData === '' || trimedFormData.length > maxLength || trimedFormData.length <= minLength){
      this.setState({[errStateVarName]: 'invalid'});
      this.props.formError({formId:'newAccount', err:'Faltan algunos de tus datos'});
      return false;
    }else{
      this.setState({[errStateVarName]: 'valid'});
      return true;
    }
  }

  validateRadioButton(){
    if(this.props.formData.gender === ''){
      this.props.formError({formId:'newAccount', err:'Tienes que seleccionar tu genero'});
      return false;
    }
    return true;
  }

  readSaveAndValidateSelect(){
    var options = $('#select')[0].selectedOptions
    var selected = [];
    if(options.length > 0){
      for(var i=0; i < options.length; i++){
        if(options[i].value !== 'default'){
          selected.push(options[i].value);
        }
      }
    }

    if(selected.length === 0){
      this.props.formError({formId:'newAccount', err:'Tienes que seleccionar tus intereses'});
      return false;
    }else{
      this.props.formInput({formId:'newAccount', inputId:'interest', text: selected});
      return true;
    }
  }

  validateEmail(email) {
    var emailTrimed = email.trim();
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailTrimed)){
      return true;
    }
    this.setState({mailInputClassName: 'invalid'});
    return false;
  }

  validateRut(rut){
    var rutTrimed = rut.trim();
    var valor = rutTrimed.replace('.','');
    valor = valor.replace('-','');
    var cuerpo = valor.slice(0,-1);
    var dv = valor.slice(-1).toUpperCase();
    rutTrimed = cuerpo + '-'+ dv
    if(cuerpo.length < 7) {
      this.props.formError({formId:'newAccount', err:'Rut no valido'});
      this.setState({newRutInputClassName: 'invalid'});
      return false;
    }
    var suma = 0;
    var multiplo = 2;
    for(var i=1;i<=cuerpo.length;i++) {
        var index = multiplo * valor.charAt(cuerpo.length - i);
        suma = suma + index;
        if(multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
    }
    var dvEsperado = 11 - (suma % 11);
    dv = (dv == 'K')?10:dv;
    dv = (dv == 0)?11:dv;
    if(dvEsperado != dv) {
      this.props.formError({formId:'newAccount', err:'Rut no valido'});
      this.setState({newRutInputClassName: 'invalid'});
      return false;
    }
    this.setState({newRutInputClassName: 'valid'});
    return true;
  }

  onClickNext(){

    var allOK = true;
    allOK = this.readSaveAndValidateSelect() && allOK ? true : false;
    allOK = this.validateRadioButton() && allOK ? true : false;
    allOK = this.validateExistenceAndLength(this.props.formData.name, 'nameInputClassName' , 32, 2) && allOK ? true : false;
    allOK = this.validateExistenceAndLength(this.props.formData.surname, 'surnameInputClassName' , 32, 2) && allOK ? true : false;
    allOK = this.validateExistenceAndLength(this.props.formData.age, 'ageInputClassName' , 32, 1) && allOK ? true : false;
    allOK = this.validateRut(this.props.formData.newRut) && allOK ? true : false;
    allOK = this.validateExistenceAndLength(this.props.formData.mail, 'mailInputClassName' , 32, 5) && allOK ? true : false;
    allOK = this.validateEmail(this.props.formData.mail) && allOK ? true : false;
    allOK = this.validateExistenceAndLength(this.props.formData.newPassword, 'newPasswordInputClassName' , 32, 4) && allOK ? true : false;
    allOK = this.validateExistenceAndLength(this.props.formData.newPasswordVer, 'newPasswordVerInputClassName' , 32, 4) && allOK ? true : false;

    //validar claves

    //dejar en minusca nombre y apeelido al enviar
    //quitar espacios al inicio y final en nombre, apellido, mail, rut, password y edad al enviar
    if(allOK){
      this.props.formError({formId:'newAccount', err:''});
      console.log('ok');
    }else{
      console.log('nop');
    }
  }

  renderErr(){
    if(this.props.formData.err !== ''){
      return (
        <div className='col s12 center-align red' style={{marginBottom: '5px'}}>
          {this.props.formData.err}
        </div>
      );
    }else{
      return (
        <div/>
      );
    }
  }

  render(){

    console.log(this.state);

    return(
      <div>
        <Modal
          open={this.props.modalState}
          //showCloseIcon={false}
          closeOnOverlayClick={false}
          closeOnEsc={false}
          onClose={() => this.onCloseModal()}
        >
          <div className="row">
            Titulo
          </div>
          <div className="row">

            <div className="col s6">
              <div className="input-field">
                <input value={this.props.formData.name} onChange={() => this.onChangeInput('name')} id="name" type="text" className={this.state.nameInputClassName}/>
                <label htmlFor="name">¿Cual es tu nombre?</label>
              </div>
            </div>
            <div className="col s6">
              <div className="input-field">
                <input value={this.props.formData.surname} onChange={() => this.onChangeInput('surname')} id="surname" type="text" className={this.state.surnameInputClassName}/>
                <label htmlFor="surname">¿Cual es tu apellido?</label>
              </div>
            </div>
            <div className="col s6">
              <div className="input-field">
                <input value={this.props.formData.age} onChange={() => this.onChangeInput('age')} id="age" type="number" className={this.state.ageInputClassName}/>
                <label htmlFor="age">¿Cual es tu Edad?</label>
              </div>
            </div>
            <div className="col s6">

              <p>
                <input name='group1' value='male' type='radio' id='radioGender1' onChange={()=> this.onChangeRadioButton('radioGender1')}/>
                <label htmlFor='radioGender1' style={{marginRight: '25px'}}>Hombre</label>
                <input name='group1' value='female' type='radio' id='radioGender2' onChange={()=> this.onChangeRadioButton('radioGender2')}/>
                <label htmlFor='radioGender2'>Mujer</label>
              </p>

            </div>

            <div className="col s12">
              <div className="input-field">
                <input value={this.props.formData.newRut} onChange={() => this.onChangeInput('newRut')} id="newRut" type="text" className={this.state.newRutInputClassName}/>
                <label htmlFor="newRut">¿Cual es tu Rut?</label>
              </div>
            </div>

            <div className="input-field col s12">
              <select id='select' defaultValue={this.props.formData.interest.length === 0 ? ["default"] : this.props.formData.interest} multiple>
                <option value="default" disabled>Puedes elegir mas de una !</option>
                <option value="leyes">Leyes</option>
                <option value="medicina">Medicina</option>
                <option value="agricultura">Agricultura</option>
              </select>
              <label>¿Cuales son tu areas de interés?</label>
            </div>

            <div className="col s12">
              <div className="input-field">
                <input value={this.props.formData.mail} onChange={() => this.onChangeInput('mail')} id="mail" type="text" className={this.state.mailInputClassName}/>
                <label htmlFor="mail">¿Cual es tu Mail?</label>
              </div>
            </div>
            <div className="col s12">
              <div className="input-field">
                <input value={this.props.formData.newPassword} onChange={() => this.onChangeInput('newPassword')} id="newPassword" type="password" className={this.state.newPasswordInputClassName}/>
                <label htmlFor="newPassword">Crea tu contraseña</label>
              </div>
            </div>
            <div className="col s12">
              <div className="input-field">
                <input value={this.props.formData.newPasswordVer} onChange={() => this.onChangeInput('newPasswordVer')} id="newPasswordVer" type="password" className={this.state.newPasswordVerInputClassName}/>
                <label htmlFor="newPasswordVer">Repite tu contraseña</label>
              </div>
            </div>

          </div>

          {this.renderErr()}

          <div className="row">
            <a onClick={() => this.onClickNext()} className="waves-effect btn light-green darken-4">TEST</a>
          </div>
        </Modal>
      </div>
    );
  }
};

function mapStateToProps(state){
  return {
    modalState: state.application.modals.newAccount,
    formData: state.forms.newAccount,
  };
};

export default connect(mapStateToProps, actions)(NewAccountModal);
