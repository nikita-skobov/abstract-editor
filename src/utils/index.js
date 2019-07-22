import React from 'react'


export const has = Object.prototype.hasOwnProperty

export function makeReactObject(Comp) {
  if (typeof Comp === 'function') {
    return <Comp />
  }

  // it already is a react object
  return Comp
}
