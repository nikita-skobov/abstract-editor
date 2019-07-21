import React, { Component } from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  fieldKey: PropTypes.string,
  fieldValue: PropTypes.string,

  // eslint-disable-next-line
  fieldType: PropTypes.string,
}

const defaultProps = {
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

    if (props.valueComponent) {
      const VC = props.valueComponent
      this.ValueComponent = (
        <VC onUpdate={this.valueChange} />
      )
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

    const { ValueComponent } = this
    if (ValueComponent) {
      return (
        <div>
          <input
            type="text"
            defaultValue={fieldKey}
            onChange={this.keyChange}
          />
          :
          {ValueComponent}
        </div>
      )
    }

    return (
      <div>
        <input
          type="text"
          defaultValue={fieldKey}
          onChange={this.keyChange}
        />
        :
        <input
          type="text"
          defaultValue={fieldValue}
          name="text"
          onChange={this.valueChange}
        />
      </div>
    )
  }
}

KeyValueField.propTypes = propTypes
KeyValueField.defaultProps = defaultProps
