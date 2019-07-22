/* global describe it expect jest */
// eslint-disable-next-line
import React from 'react'
import { shallow, mount } from 'enzyme'
import Comp, { defaultProps } from '../AbstractEditor'
import KeyValueField from '../KeyValueField'


describe('AbstractEditor component', () => {
  it('should render empty without any props', () => {
    const wrap = shallow(<Comp {...defaultProps} />)
    expect(wrap.exists()).toBe(false)
  })

  it('should render something if at least provided a outputTemplate and renderOutputTemplate', () => {
    const wrap = shallow(
      <Comp
        {...defaultProps}
        renderOutputTemplate
        outputTemplate={{ x: 1 }}
      />,
    )
    expect(wrap.exists()).toBe(true)
  })

  it('should render KeyValueFields by default', () => {
    const wrap = shallow(
      <Comp
        {...defaultProps}
        renderOutputTemplate
        outputTemplate={{ x: 1 }}
      />,
    )

    expect(wrap.find('KeyValueField').exists()).toBe(true)
  })

  it('should render a KeyValueField for every key in outputTemplate (at depth 1) if renderOutputTemplate is true', () => {
    const outputTemplate = { x: 1, y: 2, deep: { deepX: 3 } }
    const remainingKeys = Object.keys(outputTemplate)
    const wrap = shallow(
      <Comp
        {...defaultProps}
        renderOutputTemplate
        outputTemplate={outputTemplate}
      />,
    )

    expect(wrap.find('KeyValueField')).toHaveLength(remainingKeys.length)
  })

  it('should render a child instead of the outputTemplate label if present', () => {
    const outputTemplate = { x: 1, y: 2, deep: { deepX: 3 } }
    const weirdField = 'somePropThatWouldntBePresentOtherwise'
    const weirdValue = 'hi'
    const testProps = { [weirdField]: weirdValue }
    const wrap = shallow(
      <Comp
        {...defaultProps}
        renderOutputTemplate
        outputTemplate={outputTemplate}
      >
        <KeyValueField {...testProps} name="y" />
      </Comp>,
    )

    let weirdPropExists = false
    wrap.find('KeyValueField').forEach((field) => {
      if (field.prop(weirdField) === weirdValue) {
        weirdPropExists = true
      }
    })

    expect(weirdPropExists).toBe(true)
  })

  it('should call the user onUpdate callback if a key-value is changed', () => {
    const outputTemplate = { x: 1, y: 2, deep: { deepX: 3 } }
    const onUpdate = jest.fn(() => {})
    const wrap = shallow(
      <Comp
        {...defaultProps}
        onUpdate={onUpdate}
        renderOutputTemplate
        outputTemplate={outputTemplate}
      />,
    )

    const { updateKeyValue } = wrap.instance()
    // updateKeyValue(newKey, newValue, oldKey)
    updateKeyValue('x', '100', 'x')
    expect(onUpdate).toHaveBeenCalled()
  })

  it('should add a key-value field if addKeyValue is called', () => {
    const outputTemplate = { x: 1, y: 2, deep: { deepX: 3 } }
    const wrap = mount(
      <Comp
        renderOutputTemplate
        outputTemplate={outputTemplate}
      />,
    )

    const { addKeyValue } = wrap.instance()
    expect(wrap.state('stateChildren')).toHaveLength(3)
    addKeyValue()
    expect(wrap.state('stateChildren')).toHaveLength(4)
  })

  it('should add a AddKeyValueComponent if fieldType=map (and it should be at the end of the state children list)', () => {
    const outputTemplate = { x: 1, y: 2, deep: { deepX: 3 } }
    const lastLabelIndex = Object.keys(outputTemplate).length - 1
    const wrap = shallow(
      <Comp
        {...defaultProps}
        renderOutputTemplate
        fieldType="map"
        outputTemplate={outputTemplate}
      />,
    )

    expect(wrap.find('AddKeyValueField').exists()).toBe(true)
    expect(wrap.find('AddKeyValueField')).toHaveLength(1)
    expect(wrap.at(lastLabelIndex + 1).name()).toBe('AddKeyValueField')
  })

  it('should remove children from state and alter defaultTemplate on removeField and notify user that template has been changed', () => {
    const outputTemplate = { x: 1, y: 2, deep: { deepX: 3 } }
    const withoutX = { y: 2, deep: { deepX: 3 } }
    const onUpdate = jest.fn(() => {})
    const numFields = Object.keys(outputTemplate).length
    const wrap = mount(
      <Comp
        renderOutputTemplate
        onUpdate={onUpdate}
        fieldType="map"
        outputTemplate={outputTemplate}
      />,
    )

    const { removeField } = wrap.instance()
    expect(wrap.find('KeyValueField')).toHaveLength(numFields)
    removeField(0, 'x')
    wrap.update()
    expect(wrap.find('KeyValueField')).toHaveLength(numFields - 1)

    expect(onUpdate).toHaveBeenCalledWith(withoutX)
  })

  it('should call onUpdate with nested state changes', () => {
    const outputTemplate = { x: 1, y: 2, deep: {} }
    const onUpdate = jest.fn(() => {})
    const wrap = mount(
      <Comp
        outputTemplate={outputTemplate}
        onUpdate={onUpdate}
      >
        <KeyValueField name="x" />
        <KeyValueField name="y" />
        <KeyValueField
          name="deep"
          valueComponent={<Comp fieldType="map" outputTemplate={{ defaultValue: 123 }} />}
        />
      </Comp>,
    )


    const deepValueField = wrap.findWhere(n => n.prop('name') === 'deep')
    const valueComponent = deepValueField.findWhere(n => n.prop('fieldType') === 'map')
    const { updateKeyValue } = valueComponent.instance()
    updateKeyValue('defaultValue', 'abc', 'defaultValue')
    expect(onUpdate).toHaveBeenCalledWith({
      x: 1,
      y: 2,
      deep: {
        defaultValue: 'abc',
      },
    })
  })

  it('should give positionIndex to all KeyValueField children', () => {
    const outputTemplate = {
      x: 1,
      y: 2,
      deep: {},
      other: 'a',
    }

    const wrap = mount(
      <Comp
        renderOutputTemplate
        outputTemplate={outputTemplate}
      >
        <KeyValueField name="x" />
        <KeyValueField name="y" />
        <KeyValueField
          name="deep"
          valueComponent={<Comp fieldType="map" renderOutputTemplate outputTemplate={{ defaultValue: 123 }} />}
        />
      </Comp>,
    )

    wrap.find('KeyValueField').forEach((elm) => {
      expect(typeof elm.prop('positionIndex')).toBe('number')
    })
  })
})
