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

    valInput.simulate('change', { target: { value: 'newvalue' } })
    expect(onUpdate).toHaveBeenCalledWith('newkey', 'newvalue')
  })
})
