/* global describe it expect */
// eslint-disable-next-line
import React from 'react'
import { shallow, mount } from 'enzyme'
import Comp from '../MapField'


describe('MapField component', () => {
  it('should render', () => {
    const wrap = shallow(<Comp />)
    expect(wrap.exists()).toBe(true)
  })

  it('should have fieldType=map by default', () => {
    const wrap = mount(<Comp />)
    expect(wrap.prop('fieldType')).toBe('map')
  })

  it('should render a AbstractEditor', () => {
    const wrap = shallow(<Comp />)
    expect(wrap.find('AbstractEditor').exists()).toBe(true)
  })
})
