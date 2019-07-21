import React from 'react'

export default function AbstractField(props) {
  const {
    onUpdate,
    showField,
    name,
    displayName,
    fieldType,
    inputType = 'text', // default is text
  } = props

  const showName = showField && (displayName || name)

  return (
    <div>
      <span>{showField && showName}</span>
      <input
        type={inputType}
        name="text"
        onChange={({ target }) => { onUpdate(target.value) }}
      />
    </div>
  )
}
