/* global describe it expect jest */
// eslint-disable-next-line
import React from 'react'
import { mount } from 'enzyme'
import Comp from '../KeyValueField'

describe('StringField component', () => {
  it('should render', () => {
    const wrap = mount(<Comp />)
    expect(wrap.find('div').exists()).toBe(true)
  })

  it('should have two input elements by default', () => {
    const wrap = mount(<Comp />)
    const inputs = wrap.find('input')
    expect(inputs.exists()).toBe(true)
    expect(inputs).toHaveLength(2)
  })

  it('should render the inputs with key, value default values respectively', () => {
    const keyDefault = 'kd'
    const valueDefault = 'vd'
    const wrap = mount(<Comp fieldKey={keyDefault} fieldValue={valueDefault} />)
    const inputs = wrap.find('input')
    const keyInput = inputs.get(0)
    const valInput = inputs.get(1)
    expect(keyInput.props.defaultValue).toBe(keyDefault)
    expect(valInput.props.defaultValue).toBe(valueDefault)
  })

  it('should callback both the key and the value upon change', () => {
    const onUpdate = jest.fn(() => {})
    const keyDefault = 'kd'
    const valueDefault = 'vd'
    const wrap = mount(<Comp fieldKey={keyDefault} fieldValue={valueDefault} onUpdate={onUpdate} />)
    const inputs = wrap.find('input')
    const keyInput = inputs.at(0)
    const valInput = inputs.at(1)
    keyInput.simulate('change', { target: { value: 'newkey' } })
    expect(onUpdate).toHaveBeenCalledWith('newkey', 'vd')

    console.log(keyInput.getElement())

    valInput.simulate('change', { target: { value: 'newvalue' } })
    expect(onUpdate).toHaveBeenCalledWith('newkey', 'newvalue')
  })

  // it('should render the name inside the span if provided a showField attribute', () => {
  //   const name = 'bob'
  //   const wrap1 = mount(<Comp showField name={name} />)
  //   const wrap2 = mount(<Comp showField="true" name={name} />)
  //   const wrap3 = mount(<Comp showField={false} name={name} />)
  //   const span1 = wrap1.find('span')
  //   const span2 = wrap2.find('span')
  //   const span3 = wrap3.find('span')
  //   expect(span1.text()).toBe(name)
  //   expect(span2.text()).toBe(name)
  //   expect(span3.text()).not.toBe(name)
  // })

  // it('should render a displayName instead of name if provided', () => {
  //   const name = 'bob'
  //   const displayName = 'Mr. Bob'
  //   const wrap = mount(<Comp showField displayName={displayName} name={name} />)
  //   const span = wrap.find('span')
  //   expect(span.text()).toBe(displayName)
  // })

  // it('should call the onUpdate function if the input value is changed', () => {
  //   const value = 'hi'
  //   const onUpdate = jest.fn(() => {})
  //   const wrap = mount(<Comp onUpdate={onUpdate} name="tim" />)
  //   const input = wrap.find('input')
  //   input.simulate('change', { target: { value } })
  //   expect(onUpdate).toHaveBeenCalledWith(value)
  // })
})
