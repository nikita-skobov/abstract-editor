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
  } = props

  return <AbstractEditor fieldType={fieldType} />
}

MapField.propTypes = propTypes
MapField.defaultProps = defaultProps
