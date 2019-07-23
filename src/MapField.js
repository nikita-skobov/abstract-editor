import React from 'react'
import PropTypes from 'prop-types'
import AbstractEditor from './AbstractEditor'

const propTypes = {
  fieldType: PropTypes.string,
  currentValue: PropTypes.instanceOf(Object),
}

const defaultProps = {
  fieldType: 'map',
  currentValue: {},
}

export default function MapField(props) {
  const {
    fieldType,
    onUpdate,
  } = props

  return <AbstractEditor {...props} fieldType={fieldType} onUpdate={onUpdate} />
}

MapField.propTypes = propTypes
MapField.defaultProps = defaultProps
