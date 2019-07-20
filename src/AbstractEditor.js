import React from 'react'

export default function AbstractEditor(props) {
  const {
    children,
    outputTemplate,
  } = props

  const fieldNames = Object.keys(outputTemplate)
  const defaultTemplate = { ...outputTemplate }

  const inputChildren = []
  const outputChildren = []

  if (Array.isArray(children)) {
    inputChildren.push(...children)
  } else {
    // single child, but treat it as an array
    inputChildren.push(children)
  }


  inputChildren.forEach((child) => {
    const { name } = child.props
    if (fieldNames.indexOf(name) === -1) return null
    // do not render this child if it is not one of the fields
    // in the template

    const fieldType = outputTemplate[name]
    const newElm = React.cloneElement(
      child,
      {
        onUpdate: (newValue) => {
          defaultTemplate[name] = newValue
        },
      },
    )

    outputChildren.push(newElm)
    return null
  })

  return outputChildren
}
