import React from 'react'
import PropTypes from 'prop-types'
import AbstractEditor from './AbstractEditor'

const propTypes = {
  fieldType: PropTypes.string,
}

const defaultProps = {
  fieldType: 'map',
}

export default function MapField(props) {
  const {
    fieldType,
    onUpdate,
  } = props

  return <AbstractEditor fieldType={fieldType} onUpdate={onUpdate} />
}

MapField.propTypes = propTypes
MapField.defaultProps = defaultProps
