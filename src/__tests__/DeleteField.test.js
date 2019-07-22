/* global describe it expect jest */
// eslint-disable-next-line
import React from 'react'
import { mount, shallow } from 'enzyme'
import Comp from '../DeleteField'

import { DELETE_FIELD_CLASS as COMP_CLASS } from '../constants'

describe('Delete field component', () => {
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

  it('should have a default buttonText that can be edited by the user prop', () => {
    const overrideName = 'my-display-name'
    const wrap1 = mount(<Comp />)
    const wrap2 = mount(<Comp buttonText={overrideName} />)
    expect(wrap1.find('button').text()).not.toBe(overrideName)
    expect(wrap2.find('button').text()).toBe(overrideName)
  })

  it('should call the onClick function if clicked', () => {
    const onClick = jest.fn(() => {})
    const wrap1 = mount(<Comp onClick={onClick} />)
    wrap1.simulate('click')
    expect(onClick).toHaveBeenCalled()
  })
})
