/* global describe it expect jest */
// eslint-disable-next-line
import React from 'react'
import { mount } from 'enzyme'
import Comp from '../StringField'

describe('StringField component', () => {
  it('should render', () => {
    const wrap = mount(<Comp />)
    expect(wrap.find('div').exists()).toBe(true)
  })

  it('should have an input element with type=text by default', () => {
    const wrap = mount(<Comp />)
    const input = wrap.find('input')
    expect(input.exists()).toBe(true)
    expect(input.prop('type')).toBe('text')
  })

  it('should allow you to override the type attribute', () => {
    const override = 'textarea'
    const wrap = mount(<Comp inputType={override} />)
    const input = wrap.find('input')
    expect(input.exists()).toBe(true)
    expect(input.prop('type')).toBe(override)
  })

  it('should not render the name inside the span by default', () => {
    const name = 'bob'
    const wrap = mount(<Comp name={name} />)
    const span = wrap.find('span')
    expect(span.exists()).toBe(true)
    expect(span.text()).not.toBe(name)
  })

  it('should render the name inside the span if provided a showField attribute', () => {
    const name = 'bob'
    const wrap1 = mount(<Comp showField name={name} />)
    const wrap2 = mount(<Comp showField="true" name={name} />)
    const wrap3 = mount(<Comp showField={false} name={name} />)
    const span1 = wrap1.find('span')
    const span2 = wrap2.find('span')
    const span3 = wrap3.find('span')
    expect(span1.text()).toBe(name)
    expect(span2.text()).toBe(name)
    expect(span3.text()).not.toBe(name)
  })

  it('should render a displayName instead of name if provided', () => {
    const name = 'bob'
    const displayName = 'Mr. Bob'
    const wrap = mount(<Comp showField displayName={displayName} name={name} />)
    const span = wrap.find('span')
    expect(span.text()).toBe(displayName)
  })

  it('should call the onUpdate function if the input value is changed', () => {
    const value = 'hi'
    const onUpdate = jest.fn(() => {})
    const wrap = mount(<Comp onUpdate={onUpdate} name="tim" />)
    const input = wrap.find('input')
    input.simulate('change', { target: { value } })
    expect(onUpdate).toHaveBeenCalledWith(value)
  })
})
