/* global describe it expect jest */
// eslint-disable-next-line
import React from 'react'
import { mount } from 'enzyme'
import Comp from '../KeyValueField'
import Label from '../Label'

import { KEY_VALUE_CLASS as COMP_CLASS } from '../constants'

describe('KeyValueField component', () => {
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

    const currentKey = keyDefault
    const currentValue = valueDefault
    const newKey = 'newkey'
    const newValue = 'newvalue'
    keyInput.simulate('change', { target: { value: newKey } })
    expect(onUpdate).toHaveBeenCalledWith(newKey, currentValue, currentKey)

    valInput.simulate('change', { target: { value: newValue } })
    expect(onUpdate).toHaveBeenCalledWith(newKey, newValue, newKey)
  })

  it('should allow you to override the value component', () => {
    const customValueComponent = 'custom-value-component'
    const defaultWrap = mount(<Comp />)
    const wrap = mount(
      <Comp
        fieldKey=""
        fieldType="key-value"
        valueComponent={() => <input type="text" className={customValueComponent} />}
      />,
    )

    expect(wrap.find(`.${customValueComponent}`).exists()).toBe(true)
    expect(defaultWrap.find(`.${customValueComponent}`).exists()).not.toBe(true)
  })

  it('should have default prop: fieldType=key-value', () => {
    const wrap = mount(<Comp />)
    expect(wrap.prop('fieldType')).toBe('key-value')
  })

  it(`should allow the user to override the className (default should be ${COMP_CLASS})`, () => {
    const override = 'my-custom-class'
    const wrap1 = mount(<Comp />)
    const wrap2 = mount(<Comp className={override} />)
    const firstDiv1 = wrap1.find('div').first()
    const firstDiv2 = wrap2.find('div').first()
    expect(firstDiv1.hasClass(COMP_CLASS)).toBe(true)
    expect(firstDiv2.hasClass(override)).toBe(true)
  })

  it('should use Label as the default value component', () => {
    const wrap = mount(<Comp />)
    expect(wrap.find(Label).exists()).toBe(true)
  })

  it('should allow you to override the default value component', () => {
    const customValueComponent = () => <br />
    const wrap = mount(<Comp valueComponent={customValueComponent} />)
    expect(wrap.find(Label).exists()).not.toBe(true)
    expect(wrap.find(customValueComponent).exists()).toBe(true)
  })
})
