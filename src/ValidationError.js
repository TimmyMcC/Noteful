import React from 'react';
import PropTypes from 'prop-types';

export default function ValidationError(props) {
  if (props.isValid) {
    return <></>
  } else {
    return (
      <div className='form-error'>{props.message}</div>
    )   
  }
}

ValidationError.propTypes = {
  isValid: PropTypes.bool
};