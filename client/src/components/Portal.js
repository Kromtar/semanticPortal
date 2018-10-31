import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as actions from '../actions';
import { Redirect } from 'react-router-dom';

//TODO: No se ocupan cookies asi que la web no recuerda si esta conectado el usuario

class Portal extends Component {

  constructor(props) {
    super(props);
    //PARA MANEJAR POSIBLES setState luego que el componente no esta montado. Provocado por peticiones asyncronas
    this._isMounted = false;
  }

  state = {
    roomInputClassName: 'validate',
    showProgressBar: false
  }

  componentDidMount(){
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onChangeInput(inputId){
    this.props.formInput({formId:'roomSelector', inputId:inputId, text: $('#'+inputId).val()})
  }

  async onClickEnterRoom(){
    if(this.props.formData.room === ''){
      this.setState({roomInputClassName: 'invalid'});
    }else{
      var res;
      this.setState({roomInputClassName: 'valid'});
      this.setState({showProgressBar: true});
      res = await this.props.roomSelect({room: this.props.formData.room}, this.props.user.token);
      if(!res && this._isMounted){
        this.setState({showProgressBar: false});
        this.setState({roomInputClassName: 'invalid'});
        //TODO: Agregar texto de error
      }

    }
  }

  renderProsgressBar(){
    if(this.state.showProgressBar){
      return (
        <div className="progress s6 offset-s3" style={{marginTop: '14px'}}>
          <div className="indeterminate"></div>
        </div>
      );
    }else{
      return (
        <div className="row noMargin" style={{marginTop: '24px'}}>
          <div className='col s12 center-align'>
            <a onClick={() => this.onClickEnterRoom()} className="waves-effect btn light-green darken-4">Entrar a la sala</a>
          </div>
        </div>
      );
    }
  }

  handleKeyPress(input){
    if(input.key==='Enter'){
      this.onClickEnterRoom();
    }
  }

  render(){

    if(!this.props.application.userLogIn){
      return <Redirect to='/' />
    }

    if(this.props.application.expPublicId !== 0){
      if(this.props.application.expPublicId === 1){
        //Carga el experimento alpha
        return <Redirect to='/portal/alpha' />
      }
      if(this.props.application.expPublicId === 2){
        //Carga el experimento beta
        return <Redirect to='/portal/beta' />
      }
    }

    return(
        <div className='row' style={{marginTop: '30px'}}>
          <div className='col s10 l6 offset-s1 offset-l3'>
            <div className="card" style={{backgroundColor: "#f7f7f7"}}>
              <div className="card-content">

                <span className="card-title">Escribe el numero de tu sala</span>

                <div className="input-field">
                  <input
                    autoFocus
                    value={this.props.formData.room}
                    onKeyPress={(key) => this.handleKeyPress(key)}
                    onChange={() => this.onChangeInput('room')}
                    id="room"
                    type="number"
                    className={this.state.roomInputClassName}
                    ref={(input) => { this.roomInput = input; }}
                  />
                  <label htmlFor="room">Sala</label>
                </div>

                <div className="divider row noMargin"/>

                {this.renderProsgressBar()}

              </div>
            </div>
          </div>
        </div>
    );
  }
};

function mapStateToProps(state){
  return {
    formData: state.forms.roomSelector,
    application: state.application,
    user: state.user
  };
};

export default connect(mapStateToProps, actions)(Portal);
