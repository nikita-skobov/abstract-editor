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


    if (fieldType === 'map' && props.addKeyValueComponent) {
      const Temp = props.addKeyValueComponent
      this.AddKeyValueComp = (
        <Temp
          fieldType="add-key-value"
          onUpdate={this.addKeyValue}
        />
      )
      // override the user provided element, and use that for future
      // rendering to avoid overriding during render.
    } else if (fieldType === 'map') {
      this.AddKeyValueComp = (
        <AddKeyValueField
          fieldType="add-key-value"
          onUpdate={this.addKeyValue}
        />
      )
      // user did not provide an AddKeyValueField component
      // so use the default one.
    }

    if (fieldType === 'map' && props.keyValueComponent) {
      const Temp = props.keyValueComponent
      this.KeyValueComp = (
        <Temp
          fieldType="key-value"
          onUpdate={this.updateKeyValue}
        />
      )
      // user providedd a key value component, override it
      // to avoid doing so during render.
    } else if (fieldType === 'map') {
      this.KeyValueComp = (
        <KeyValueField
          fieldType="key-value"
          onUpdate={this.updateKeyValue}
        />
      )
      // user did not provide a KeyValueField component
      // so use the default one.
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
