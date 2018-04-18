
import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as actions from '../../actions';

import HelpModal from './HelpModal';

class ExpMain extends Component {

  state = {
    helpModal: false,
    progressBarOnHelpModal: false,
  }

  componentDidMount(){
    this.initialLoad();
  }

  async initialLoad(){
    //hacer set de this.props.expAlpha.loadingUserTest en true
    this.setState({helpModal: true, progressBarOnHelpModal: true});
    const testLoaded = await this.props.loadUserTest({experimentId: this.props.application.activeExpId}, this.props.user.token);
    if(testLoaded){
      this.props.loadNewWord({testId: this.props.expAlpha.testId}, this.props.user.token);
    }else{
      //Error al cargar el test, salir de la pagina
    }
  }

  onCloseHelpModal(){
    this.setState({helpModal: false});
  }

  render(){

    return(
      <div>

        <HelpModal
          onCloseModal={() => this.onCloseHelpModal()}
          isOpen={this.state.helpModal}
          text={this.props.expAlpha.parameters.instructions}
          showProgress={this.state.progressBarOnHelpModal}
        />

      </div>
    );
  }
};

function mapStateToProps(state){
  return {
    application: state.application,
    expAlpha: state.expAlpha,
    user: state.user
  };
};

export default connect(mapStateToProps, actions)(ExpMain);
