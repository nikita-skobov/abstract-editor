import React, { Component } from 'react'
import PropTypes from 'prop-types'

import KeyValueField from './KeyValueField'
import AddKeyValueField from './AddKeyValueField'

import { has, makeReactObject } from './utils'

const propTypes = {
  addKeyValueComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),

  keyValueComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),
}
const defaultProps = {
  addKeyValueComponent: AddKeyValueField,
  keyValueComponent: KeyValueField,
}

export default class AbstractEditor extends Component {
  constructor(props) {
    super(props)

    const { fieldType, children, renderOutputTemplate } = this.props

    this.addKeyValue = this.addKeyValue.bind(this)
    this.updateKeyValue = this.updateKeyValue.bind(this)
    this.keyIsEditable = this.keyIsEditable.bind(this)
    this.removeField = this.removeField.bind(this)

    this.defaultTemplate = { ...props.outputTemplate }
    this.defaultTemplateKeys = Object.keys(this.defaultTemplate)
    this.keyCounter = 0


    this.AddKeyValueComp = makeReactObject(props.addKeyValueComponent, {
      fieldType: 'add-key-value',
    })
    this.KeyValueComp = makeReactObject(props.keyValueComponent)


    const stateChildren = []
    if (fieldType === 'map') {
      const { AddKeyValueComp } = this
      stateChildren.push(AddKeyValueComp)
    } else if (Array.isArray(children)) {
      stateChildren.push(...children)
    } else {
      // single child, but treat it as an array
      stateChildren.push(children)
    }

    if (renderOutputTemplate) {
      // loop through children name props.
      // if the outputTemplate contains keys that
      // are not present in the children,
      // add children based on the outputTemplate
      const outputKeys = Object.keys(props.outputTemplate)
      stateChildren.forEach((child) => {
        if (child.props && child.props.name) {
          const index = outputKeys.indexOf(child.props.name)
          if (index !== -1) outputKeys.splice(index, 1)
        }
      })

      // by this point, the only keys left in outputKeys will be
      // keys present in the outputTemplate, but were not provided
      // as renderable children
      outputKeys.forEach((key) => {
        const obj = props.outputTemplate[key]
        if (typeof obj === 'string' || typeof obj === 'number') {
          // treat it as a standard key-value field
          const { KeyValueComp } = this
          const isEditable = this.keyIsEditable(key)
          const newComp = React.cloneElement(KeyValueComp, {
            name: key,
            editable: isEditable,
            onRemove: isEditable ? this.removeField : () => { console.log('cannot remove this field') },
            fieldKey: key,
          })
          stateChildren.push(newComp)
        } else if (Array.isArray(obj)) {
          // if an array treat as an array field
        } else {
          // treat as a map field
        }
      })
    }

    this.state = {
      stateChildren,
    }
  }

  keyIsEditable(name) {
    const { defaultTemplateKeys } = this
    if (defaultTemplateKeys.indexOf(name) === -1) {
      // this key is NOT included in the template provided
      // so we assume it is a user created key-value, therefore
      // we allow it to be editable
      return true
    }

    // otherwise if the template DOES HAVE that key,
    // then we do not want the user to alter this key name,
    // otherwise they would be altering the outputTemplate
    return false
  }

  addKeyValue() {
    this.setState((prevState) => {
      const { stateChildren } = prevState
      const lastChild = stateChildren[stateChildren.length - 1]
      const firstNChildren = stateChildren.slice(0, stateChildren.length - 1)

      const nextKeyValue = React.cloneElement(this.KeyValueComp, {
        key: this.keyCounter.toString(),
      })
      this.keyCounter += 1

      const newChildren = [...firstNChildren, nextKeyValue, lastChild]
      const newState = { stateChildren: newChildren }
      return newState
    })
  }

  removeField(index, fieldName) {
    const { defaultTemplate } = this
    const { onUpdate } = this.props

    if (has.call(defaultTemplate, fieldName)) {
      delete defaultTemplate[fieldName]
      onUpdate({ ...defaultTemplate })
      // in case we modify out current template state
      // notify our parent that our template
      // has updated
    }

    this.setState((prevState) => {
      const newState = prevState
      const { stateChildren } = prevState
      const modifiableChildren = [...stateChildren]
      modifiableChildren.splice(index, 1)
      // the component that calls this callback function knows
      // its positionIndex via a prop. it uses that position index
      // to let this component know which element to remove
      // from the state children array.
      newState.stateChildren = modifiableChildren
      return newState
    })
  }

  updateKeyValue(newKey, newValue, oldKey) {
    if (oldKey !== newKey) {
      if (has.call(this.defaultTemplate, oldKey)) {
        delete this.defaultTemplate[oldKey]
      }
    }
    this.defaultTemplate[newKey] = newValue

    const { onUpdate } = this.props
    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate({ ...this.defaultTemplate })
    }
  }

  render() {
    const { onUpdate } = this.props
    const { stateChildren: children } = this.state

    const outputChildren = []


    children.forEach((child, ind) => {
      const { name, fieldType } = child.props

      let newElm
      if (fieldType === 'add-key-value') {
        newElm = React.cloneElement(
          child,
          {
            onUpdate: this.addKeyValue,
          },
        )
      } else if (fieldType === 'map') {
        newElm = React.cloneElement(
          child,
          {
            onUpdate: (newValue) => {
              this.defaultTemplate[name] = newValue
              if (onUpdate && typeof onUpdate === 'function') {
                onUpdate({ ...this.defaultTemplate })
              }
            },
          },
        )
      } else if (fieldType === 'key-value') {
        const { name: childName } = child.props
        newElm = React.cloneElement(
          child,
          {
            onUpdate: this.updateKeyValue,
            onRemove: this.keyIsEditable(name) ? this.removeField : (a, f) => {console.log(`should not remove ${f}`)},
            editable: this.keyIsEditable(name),
            fieldKey: childName,
            positionIndex: ind,
          },
        )
      } else {
        newElm = React.cloneElement(
          child,
          {
            onUpdate: (newValue) => {
              this.defaultTemplate[name] = newValue
              if (onUpdate && typeof onUpdate === 'function') {
                onUpdate({ ...this.defaultTemplate })
              }
              // calling the user supplied update function
              // to give them the most recent template
            },
          },
        )
      }

      outputChildren.push(newElm)
      return null
    })

    return outputChildren
  }
}


AbstractEditor.propTypes = propTypes
AbstractEditor.defaultProps = defaultProps
