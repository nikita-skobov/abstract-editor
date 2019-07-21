import React from 'react'

import KeyValueField from './KeyValueField'


export default function AbstractEditor(props) {
  const {
    children,
    outputTemplate,
    onUpdate,
    name,
  } = props

  const fieldNames = Object.keys(outputTemplate)
  const defaultTemplate = { ...outputTemplate }

  const inputChildren = []
  const outputChildren = []

  // if (fieldType === 'map') {
  //    inputChildren.push(<StringField fieldType="key-value" />)

  if (Array.isArray(children)) {
    inputChildren.push(...children)
  } else {
    // single child, but treat it as an array
    inputChildren.push(children)
  }

  console.log('ic:')
  console.log(inputChildren)


  inputChildren.forEach((child) => {
    const { name, fieldType } = child.props

    let newElm
    if (fieldType === 'map') {
      newElm = React.cloneElement(
        child,
        {
          onUpdate: (newValue) => {
            defaultTemplate[name] = newValue
            if (onUpdate && typeof onUpdate === 'function') {
              onUpdate({ ...defaultTemplate })
            }
          },
          children: <KeyValueField fieldType="key-value" fieldKey="test" fieldValue="123" />,
        },
      )
    } else if (fieldType === 'key-value') {
      newElm = React.cloneElement(
        child,
        {
          onUpdate: (k, v) => {
            defaultTemplate[k] = v
            if (onUpdate && typeof onUpdate === 'function') {
              onUpdate({ ...defaultTemplate })
            }
          },
        },
      )
    } else {
      newElm = React.cloneElement(
        child,
        {
          onUpdate: (newValue) => {
            defaultTemplate[name] = newValue
            if (onUpdate && typeof onUpdate === 'function') {
              onUpdate({ ...defaultTemplate })
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

  console.log('oc: ')
  console.log(outputChildren)

  return outputChildren
}
