import React from 'react';

var Collapsable = React.createClass({

  //Set validation for prop types
  propTypes: {
    transitionTime: React.PropTypes.number,
    triggerText: React.PropTypes.string.isRequired,
    easing: React.PropTypes.string,
    startOpen: React.PropTypes.bool,
    classParentString: React.PropTypes.string,
  },

  //If no transition time or easing is passed then default to this
  getDefaultProps: function() {
    return {
      transitionTime: 400,
      easing: 'linear',
      startOpen: false,
      classParentString: 'Collapsible'
    };
  },

  //Defaults the dropdown to be closed
  getInitialState: function(){

    if(this.props.startOpen){
      return {
        isClosed: false,
        shouldSwitchAutoOnNextCycle: false,
        height: 'auto',
        transition: 'none'
      }
    }
    else{
      return {
        isClosed: true,
        shouldSwitchAutoOnNextCycle: false,
        height: 0,
        transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing
      }
    }
  },

  componentDidMount: function() {
    //Set up event listener to listen to transitionend so we can switch the height from fixed pixel to auto for much responsiveness;
    //TODO:  Once Synthetic transitionend events have been exposed in the next release of React move this funciton to a function handed to the onTransitionEnd prop

    this.refs.outer.addEventListener('transitionend', (event) => {
      if(this.state.isClosed === false){
        this.setState({
          shouldSwitchAutoOnNextCycle: true
        });
      }

    });
  },

  componentDidUpdate: function() {


    if(this.state.shouldSwitchAutoOnNextCycle === true && this.state.isClosed === false) {
      //Set the height to auto to make compoenent re-render with the height set to auto.
      //This way the dropdown will be responsive and also change height if there is another dropdown within it.
      this.setState({
        height: 'auto',
        transition: 'none',
        shouldSwitchAutoOnNextCycle: false
      });
    }

    if(this.state.shouldSwitchAutoOnNextCycle === true && this.state.isClosed === true) {

      //The height has been changes back to fixed pixel, we set a small timeout to force the CSS transition back to 0 on the next tick.
      window.setTimeout(() => {
        this.setState({
          height: 0,
          shouldSwitchAutoOnNextCycle: false,
          transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing
        });
      }, 50);
    }
  },

  handleTriggerClick: function(event) {

    event.preventDefault();

    if(this.state.isClosed === true){
      this.setState({
        height: this.refs.inner.offsetHeight,
        transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing,
        isClosed: false
      });
    }
    else {
      this.setState({
        isClosed: true,
        shouldSwitchAutoOnNextCycle: true,
        height: this.refs.inner.offsetHeight
      });
    }

  },

  render: function () {

    var dropdownStyle = {
      height: this.state.height,
      transition: this.state.transition,
      overflow: 'hidden'
    }

    var openClass = this.state.isClosed ? 'is-closed' : 'is-open';

    return(
      <div className={this.props.classParentString}>
        <a href="#" className={this.props.classParentString + "__trigger" + ' ' + openClass} onClick={this.handleTriggerClick}>{this.props.triggerText}</a>
        <div className={this.props.classParentString + "__contentOuter" } ref="outer" style={dropdownStyle}>
          <div className={this.props.classParentString + "__contentInner"} ref="inner">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

});

export default Collapsable;
