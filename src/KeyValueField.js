import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Label from './Label'
import { KEY_VALUE_CLASS } from './constants'

const propTypes = {
  fieldKey: PropTypes.string,
  fieldValue: PropTypes.string,
  className: PropTypes.string,
  keyComponent: PropTypes.func,
  valueComponent: PropTypes.func,

  // eslint-disable-next-line
  fieldType: PropTypes.string,
}

const defaultProps = {
  valueComponent: Label,
  keyComponent: Label,
  className: KEY_VALUE_CLASS,
  fieldType: 'key-value',
  fieldKey: '',
  fieldValue: '',
}

export default class KeyValueField extends Component {
  constructor(props) {
    super(props)

    this.keyChange = this.keyChange.bind(this)
    this.valueChange = this.valueChange.bind(this)

    this.state = {
      fieldKey: props.fieldKey,
      fieldValue: props.fieldValue,
    }
  }

  keyChange({ target }) {
    const { props } = this
    const { value } = target
    // value is the value of the new input
    // not the key:value!

    this.setState((prevState) => {
      const newState = {
        fieldKey: value,
        fieldValue: prevState.fieldValue,
      }
      const { onUpdate } = props
      onUpdate(value, prevState.fieldValue, prevState.fieldKey)

      return newState
    })
  }

  valueChange(e) {
    const { target } = e
    const { props } = this

    let newValue

    if (target) {
      // this means it is a value change from an input field
      const { value } = target
      newValue = value
    } else {
      // otherwise it is a custom value change
      // where the argument IS the new value
      newValue = e
    }

    this.setState((prevState) => {
      const newState = {
        fieldKey: prevState.fieldKey,
        fieldValue: newValue,
      }
      const { onUpdate } = props
      onUpdate(prevState.fieldKey, newValue, prevState.fieldKey)

      return newState
    })
  }

  render() {
    const {
      fieldKey,
      fieldValue,
    } = this.state
    const { className, valueComponent, keyComponent } = this.props

    const ValueComponent = valueComponent
    const KeyComponent = keyComponent

    const kc = (
      <KeyComponent
        currentValue={fieldKey}
        onUpdate={this.keyChange}
      />
    )
    const vc = (
      <ValueComponent
        currentValue={fieldValue}
        onUpdate={this.valueChange}
      />
    )

    return (
      <div className={className}>
        {kc}
        :
        {vc}
      </div>
    )
  }
}

KeyValueField.propTypes = propTypes
KeyValueField.defaultProps = defaultProps
