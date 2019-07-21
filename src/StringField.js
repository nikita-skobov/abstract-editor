import React from 'react'

export default function StringField(props) {
  const {
    onUpdate,
    showField,
    name,
    displayName,
    type = 'text', // default is text
  } = props

  const showName = showField && (displayName || name)

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
