/* global describe it expect */
// eslint-disable-next-line
import React from 'react'
import { mount } from 'enzyme'
import Dummy from '../index'

describe('dummy component', () => {
  it('should render text', () => {
    const wrap = mount(<Dummy />)
    expect(wrap.text()).not.toBe('')
  })
})

