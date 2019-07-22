import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { makeReactObject } from './utils'
import Label from './Label'
import DelteField from './DeleteField'
import { KEY_VALUE_CLASS } from './constants'

const propTypes = {
  fieldKey: PropTypes.string,
  fieldValue: PropTypes.string,
  className: PropTypes.string,
  editable: PropTypes.bool,
  positionIndex: PropTypes.number.isRequired,

  keyClass: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.any,
  ]),
  keyComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),


  valueClass: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.any,
  ]),
  valueComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),

  deleteComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),

  // eslint-disable-next-line
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,

  // eslint-disable-next-line
  fieldType: PropTypes.string,
}

const defaultProps = {
  editable: true,
  onUpdate: undefined,
  onRemove: undefined,
  valueComponent: Label,
  deleteComponent: DelteField,
  valueClass: undefined,
  keyComponent: Label,
  keyClass: undefined,
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
    this.removeField = this.removeField.bind(this)

    this.state = {
      fieldKey: props.fieldKey,
      fieldValue: props.fieldValue,
    }

    this.ValueComponent = makeReactObject(props.valueComponent)
    this.KeyComponent = makeReactObject(props.keyComponent)
    this.DeleteComponent = makeReactObject(props.deleteComponent)
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

  removeField() {
    const { onRemove, positionIndex } = this.props
    const { fieldKey } = this.state
    if (onRemove && typeof onRemove === 'function') {
      onRemove(positionIndex, fieldKey)
    }
  }

  render() {
    const {
      fieldKey,
      fieldValue,
    } = this.state

    const {
      className,
      valueClass,
      keyClass,
      editable,
    } = this.props

    const {
      ValueComponent,
      KeyComponent,
      DeleteComponent,
    } = this

    // let tc1
    // let tc2

    // if (testComponent1) {
    //   console.log('start: ')
    //   console.log(testComponent1)
    //   console.log(testComponent2)
    //   const TC1 = testComponent1
    //   const TC2 = testComponent2
    //   console.log(TC1)
    //   console.log(TC2)
    //   tc1 = makeReactObject(TC1)
    //   tc2 = makeReactObject(TC2)
    //   console.log(tc1)
    //   console.log(tc2)
    // }


    const kc = React.cloneElement(KeyComponent, {
      className: keyClass,
      currentValue: fieldKey,
      onUpdate: this.keyChange,
      editable,
    })

    const vc = React.cloneElement(ValueComponent, {
      className: valueClass,
      currentValue: fieldValue,
      onUpdate: this.valueChange,
    })

    const dc = editable
      ? React.cloneElement(DeleteComponent, {
        onClick: this.removeField,
      })
      : null
    // dont render the delete component if this field is not editable

    return (
      <div className={className}>
        {kc}
        :
        {vc}
        {dc}
      </div>
    )
  }
}

KeyValueField.propTypes = propTypes
KeyValueField.defaultProps = defaultProps
