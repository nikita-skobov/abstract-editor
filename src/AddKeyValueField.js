import React from 'react'
import PropTypes from 'prop-types'

import { ADD_KEY_VALUE_CLASS } from './constants'

const propTypes = {
  className: PropTypes.string,
  onUpdate: PropTypes.func,
  displayName: PropTypes.string,
}
const defaultProps = {
  className: ADD_KEY_VALUE_CLASS,
  onUpdate: () => {},
  displayName: '+',
}

export default function AddKeyValueField(props) {
  const {
    onUpdate,
    className,
    displayName,
  } = props

  return (
    <button className={className} type="button" onClick={onUpdate}>{displayName}</button>
  )
}

AddKeyValueField.propTypes = propTypes
AddKeyValueField.defaultProps = defaultProps
