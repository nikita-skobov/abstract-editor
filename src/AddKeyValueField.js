import React from 'react'

export default function AddKeyValueField(props) {
  const {
    onUpdate,
    displayName = '+',
  } = props

  return (
    <button type="button" onClick={() => { onUpdate() }}>{displayName}</button>
  )
}
