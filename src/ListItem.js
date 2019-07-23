import React from 'react'
import PropTypes from 'prop-types'

import Label from './Label'
import DeleteField from './DeleteField'

const propTypes = {
  defaultValue: PropTypes.string,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  positionIndex: PropTypes.number.isRequired,
}
const defaultProps = {
  defaultValue: '',
  onDelete: () => {},
  onUpdate: () => {},
}

export default function ListItem(props) {
  const {
    onUpdate: outerUpdate,
    positionIndex,
    defaultValue,
    onDelete,
  } = props

  const innerUpdate = (e) => {
    const { target } = e
    const { value } = target
    outerUpdate(value, positionIndex)
  }

  const innerDelete = () => {
    onDelete(positionIndex)
  }

  return (
    <div>
      <Label onUpdate={innerUpdate} defaultValue={defaultValue} />
      <DeleteField onClick={innerDelete} />
    </div>
  )
}

ListItem.propTypes = propTypes
ListItem.defaultProps = defaultProps
