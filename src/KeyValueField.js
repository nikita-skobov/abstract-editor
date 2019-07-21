import React from 'react'

export default function AbstractField(props) {
  const {
    onUpdate,
    fieldKey,
    fieldValue,
  } = props

  return (
    <div>
      <input
        type="text"
        defaultValue={fieldKey}
        onChange={({ target }) => { onUpdate(target.value, fieldValue) }}
      />
      :
      <input
        type="text"
        defaultValue={fieldValue}
        name="text"
        onChange={({ target }) => { onUpdate(fieldKey, target.value) }}
      />
    </div>
  )
}
