import React from 'react'


export const has = Object.prototype.hasOwnProperty

export function makeReactObject(Comp, useProps = {}) {
  if (typeof Comp === 'function') {
    return <Comp {...useProps} />
  }

  // it already is a react object
  return Comp
}
