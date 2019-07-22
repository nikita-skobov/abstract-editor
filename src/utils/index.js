import React from 'react'

export function makeReactObject(Comp) {
  if (typeof Comp === 'function') {
    return <Comp />
  }

  // it already is a react object
  return Comp
}
