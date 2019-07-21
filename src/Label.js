import React from 'react'
import PropTypes from 'prop-types'

const defaultProps = {

}
const propTypes = {

}


export default function Label(props) {
  return (
    <input
      type="text"
      defaultValue={props.currentValue}
      onChange={props.onUpdate}
    />
  )
}

Label.defaultProps = defaultProps
Label.propTypes = propTypes
