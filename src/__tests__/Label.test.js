/* global describe it expect jest */
// eslint-disable-next-line
import React from 'react'
import { mount, shallow } from 'enzyme'
import Comp from '../Label'

import { LABEL_CLASS as COMP_CLASS } from '../constants'

describe('Label component', () => {
  it('should render', () => {
    const wrap = mount(<Comp />)
    expect(wrap.find('input').exists()).toBe(true)
  })

  it(`should allow the user to override the className (default should be ${COMP_CLASS})`, () => {
    const override = 'my-custom-class'
    const wrap1 = mount(<Comp />)
    const wrap2 = mount(<Comp className={override} />)
    expect(wrap1.first().hasClass(COMP_CLASS)).toBe(true)
    expect(wrap2.first().hasClass(override)).toBe(true)
  })

  it('should render a span if not editable', () => {
    const wrap = shallow(<Comp editable={false} />)
    expect(wrap.first().type()).toBe('span')
  })

  it('should render the currentValue prop either as input value, or span text', () => {
    const currentValue = 'cv'
    const wrap1 = mount(<Comp editable={false} currentValue={currentValue} />)
    const wrap2 = mount(<Comp currentValue={currentValue} />)
    expect(wrap1.find('span').text()).toBe(currentValue)
    expect(wrap2.find('input').instance().value).toBe(currentValue)
  })
})
