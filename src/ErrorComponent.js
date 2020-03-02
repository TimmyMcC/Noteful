import React from 'react';

export default class ErrorComponent extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        hasError: false
      };
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  };

  render() {
      if (this.state.hasError) {      
        return (
          <h2>An error has occurred. Apologies.</h2>
        );
      }
      return this.props.children;
  }
}