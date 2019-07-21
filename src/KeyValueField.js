import React from 'react'

export default function AbstractField(props) {
  const {
    onUpdate,
    fieldKey,
    fieldValue,
  } = props

  return (
    <div>
      <input type="string" defaultValue={fieldKey} />
      :
      <input
        type="text"
        placeholder={fieldValue}
        defaultValue={fieldValue}
        name="text"
        onChange={({ target }) => { onUpdate(fieldKey, target.value) }}
      />
    </div>
  )
}
