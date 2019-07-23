import React from 'react'
import PropTypes from 'prop-types'

import { LABEL_CLASS } from './constants'

const propTypes = {
  className: PropTypes.string,
  editable: PropTypes.bool,
  onUpdate: PropTypes.func,
  currentValue: PropTypes.string,
}

const defaultProps = {
  currentValue: '',
  editable: true,
  className: LABEL_CLASS,
  onUpdate: () => {},
}


export default function Label(props) {
  const {
    className,
    onUpdate,
    currentValue,
    editable,
  } = props

  if (editable) {
    return (
      <input
        className={className}
        type="text"
        defaultValue={currentValue}
        onChange={onUpdate}
      />
    )
  }

  return (
    <span className={className}>
      {currentValue}
    </span>
  )
}

Label.defaultProps = defaultProps
Label.propTypes = propTypes
