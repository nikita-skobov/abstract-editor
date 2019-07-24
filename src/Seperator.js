import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf([PropTypes.string, PropTypes.element]),
  ]),
}
const defaultProps = {
  children: ':',
}

export default function Seperator(props) {
  const { children } = props
  return <span {...props}>{children}</span>
}

Seperator.propTypes = propTypes
Seperator.defaultProps = defaultProps
