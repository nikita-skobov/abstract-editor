import React from 'react'
import PropTypes from 'prop-types'

import Label from './Label'

const propTypes = {
  outputTemplate: PropTypes.string,
  onUpdate: PropTypes.func,
}
const defaultProps = {
  outputTemplate: '',
  onUpdate: () => {},
}

export default function ListItem(props) {
  const {
    onUpdate: outerUpdate,
    outputTemplate,
  } = props

  const innerUpdate = (e) => {
    const { target } = e
    const { value } = target
    outerUpdate(value)
  }

  return (
    <div>
      <Label onUpdate={innerUpdate} defaultValue={outputTemplate} />
    </div>
  )
}

ListItem.propTypes = propTypes
ListItem.defaultProps = defaultProps
