/* global describe it expect jest */
// eslint-disable-next-line
import React from 'react'
import { mount, shallow } from 'enzyme'
import Comp from '../AddKeyValueField'

import { ADD_KEY_VALUE_CLASS as COMP_CLASS } from '../constants'

describe('Add key value component', () => {
  it('should render', () => {
    const wrap = mount(<Comp />)
    expect(wrap.html().charAt(0)).toBe('<')
  })

  it(`should allow the user to override the className (default should be ${COMP_CLASS})`, () => {
    const override = 'my-custom-class'
    const wrap1 = mount(<Comp />)
    const wrap2 = mount(<Comp className={override} />)
    expect(wrap1.first().hasClass(COMP_CLASS)).toBe(true)
    expect(wrap2.first().hasClass(override)).toBe(true)
  })

  it('should render a button', () => {
    const wrap = shallow(<Comp />)
    expect(wrap.first().type()).toBe('button')
  })

  it('should have a default displayName that can be edited by the user prop', () => {
    const overrideName = 'my-display-name'
    const wrap1 = mount(<Comp />)
    const wrap2 = mount(<Comp displayName={overrideName} />)
    expect(wrap1.find('button').text()).not.toBe(overrideName)
    expect(wrap2.find('button').text()).toBe(overrideName)
  })

  it('should call the onUpdate function if clicked', () => {
    const onUpdate = jest.fn(() => {})
    const wrap1 = mount(<Comp onUpdate={onUpdate} />)
    wrap1.simulate('click')
    expect(onUpdate).toHaveBeenCalled()
  })
})
