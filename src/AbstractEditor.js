import React, { Component } from 'react'

import KeyValueField from './KeyValueField'
import AddKeyValueField from './AddKeyValueField'

import { has } from './utils'

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


    const Temp = props.addKeyValueComponent || AddKeyValueField
    this.AddKeyValueComp = (
      <Temp
        fieldType="add-key-value"
        onUpdate={this.addKeyValue}
      />
    )
    // override the user provided element (if provided, otherwise use the default),
    // and use that for future
    // rendering to avoid overriding during render.

    const Temp2 = props.keyValueComponent || KeyValueField
    this.KeyValueComp = (
      <Temp2
        onUpdate={this.updateKeyValue}
        onRemove={this.removeField}
      />
    )
    // override the key value component with either the user
    // provided prop, or the default
    // to avoid doing so during render.


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
          const newComp = {
            ...KeyValueComp,
            props: {
              ...KeyValueComp.props,
              name: key,
              editable: this.keyIsEditable(key),
              onRemove: this.keyIsEditable(key) ? this.removeField : (a, f) => { console.log(`should not remove ${f}`) },
              fieldKey: key,
            },
          }
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

      const nextKeyValue = {
        ...this.KeyValueComp,
        props: { ...this.KeyValueComp.props },
        key: this.keyCounter.toString(),
      }

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
        newElm = child
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
        const { onUpdate: childUpdate, name: childName } = child.props
        if (childUpdate && typeof childUpdate === 'function') {
          // if it already has the function no need to clone
          newElm = {
            ...child,
            props: {
              ...child.props,
              positionIndex: ind,
            },
          }
        } else {
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
        }
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
