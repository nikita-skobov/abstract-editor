import React, { Component } from 'react'

export default class KeyValueField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fieldKey: props.fieldKey,
      fieldValue: props.fieldValue,
    }

    this.keyChange = this.keyChange.bind(this)
    this.valueChange = this.valueChange.bind(this)
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

  valueChange({ target }) {
    const { props } = this
    const { value } = target
    // value is the fieldValue!

    this.setState((prevState) => {
      const newState = {
        fieldKey: prevState.fieldKey,
        fieldValue: value,
      }
      const { onUpdate } = props
      onUpdate(prevState.fieldKey, value, prevState.fieldKey)

      return newState
    })
  }

  render() {
    const {
      fieldKey,
      fieldValue,
    } = this.state

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
