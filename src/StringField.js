import React from 'react'

export default function AbstractField(props) {
  const {
    onUpdate,
    showField,
    name,
    displayName,
    type = 'text', // default is text
  } = props

  const showName = showField && (displayName || name)

  // otherwise assume it is a string input
  return (
    <div>
      <span>{showField && showName}</span>
      <input
        type={type}
        name="text"
        onChange={({ target }) => { onUpdate(target.value) }}
      />
    </div>
  )
}
