import React from 'react'
import PropTypes from 'prop-types'

import { DELETE_FIELD_CLASS } from './constants'

const propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  buttonText: PropTypes.string,
}
const defaultProps = {
  buttonText: 'X',
  className: DELETE_FIELD_CLASS,
  onClick: () => {},
}

export default function DeleteField(props) {
  const {
    onClick,
    buttonText,
    className,
  } = props

  return (
    <button className={className} type="button" onClick={onClick}>{buttonText}</button>
  )
}

DeleteField.propTypes = propTypes
DeleteField.defaultProps = defaultProps
