import React, { Component } from 'react'

import KeyValueField from './KeyValueField'
import AddKeyValueField from './AddKeyValueField'

const has = Object.prototype.hasOwnProperty

export default class AbstractEditor extends Component {
  constructor(props) {
    super(props)

    const { fieldType, children } = this.props

    this.addKeyValue = this.addKeyValue.bind(this)
    this.updateKeyValue = this.updateKeyValue.bind(this)


    if (fieldType === 'map') {
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
          fieldType="key-value"
          onUpdate={this.updateKeyValue}
        />
      )
      // override the key value component with either the user
      // provided prop, or the default
      // to avoid doing so during render.
    }


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

    this.state = {
      stateChildren,
    }
    this.defaultTemplate = { ...props.outputTemplate }
  }

  addKeyValue() {
    this.setState((prevState) => {
      const { stateChildren } = prevState
      const lastChild = stateChildren[stateChildren.length - 1]
      const firstNChildren = stateChildren.slice(0, stateChildren.length - 1)
      const newChildren = [...firstNChildren, this.KeyValueComp, lastChild]
      const newState = { stateChildren: newChildren }
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


    children.forEach((child) => {
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
        newElm = child
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
