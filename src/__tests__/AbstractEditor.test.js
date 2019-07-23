/* global describe it expect jest */
// eslint-disable-next-line
import React from 'react'
import { shallow, mount } from 'enzyme'
import Comp, { defaultProps } from '../AbstractEditor'
import KeyValueField from '../KeyValueField'
import ListField from '../ListField'
import MapField from '../MapField'


describe('AbstractEditor component', () => {
  it('should render empty without any props', () => {
    const wrap = shallow(<Comp {...defaultProps} />)
    expect(wrap.exists()).toBe(false)
  })

  it('should render something if at least provided a currentValue and renderOutputTemplate', () => {
    const wrap = shallow(
      <Comp
        {...defaultProps}
        renderOutputTemplate
        currentValue={{ x: 1 }}
      />,
    )
    expect(wrap.exists()).toBe(true)
  })

  it('should render KeyValueFields by default', () => {
    const wrap = shallow(
      <Comp
        {...defaultProps}
        renderOutputTemplate
        currentValue={{ x: 1 }}
      />,
    )

    expect(wrap.find('KeyValueField').exists()).toBe(true)
  })

  it('should render a KeyValueField for every key in currentValue (at depth 1) if renderOutputTemplate is true', () => {
    const currentValue = { x: 1, y: 2, deep: { deepX: 3 } }
    const remainingKeys = Object.keys(currentValue)
    const wrap = shallow(
      <Comp
        {...defaultProps}
        renderOutputTemplate
        currentValue={currentValue}
      />,
    )

    expect(wrap.find('KeyValueField')).toHaveLength(remainingKeys.length)
  })

  it('should render a child instead of the currentValue label if present', () => {
    const currentValue = { x: 1, y: 2, deep: { deepX: 3 } }
    const weirdField = 'somePropThatWouldntBePresentOtherwise'
    const weirdValue = 'hi'
    const testProps = { [weirdField]: weirdValue }
    const wrap = shallow(
      <Comp
        {...defaultProps}
        renderOutputTemplate
        currentValue={currentValue}
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
    const currentValue = { x: 1, y: 2, deep: { deepX: 3 } }
    const onUpdate = jest.fn(() => {})
    const wrap = shallow(
      <Comp
        {...defaultProps}
        onUpdate={onUpdate}
        renderOutputTemplate
        currentValue={currentValue}
      />,
    )

    const { updateKeyValue } = wrap.instance()
    // updateKeyValue(newKey, newValue, oldKey)
    updateKeyValue('x', '100', 'x', 0)
    // x is the first key in the currentValue
    // so it has a positionIndex of 0
    expect(onUpdate).toHaveBeenCalled()
  })

  it('should add a key-value field if addKeyValue is called', () => {
    const currentValue = { x: 1, y: 2, deep: { deepX: 3 } }
    const wrap = mount(
      <Comp
        renderOutputTemplate
        currentValue={currentValue}
      />,
    )

    const { addKeyValue } = wrap.instance()
    expect(wrap.state('stateChildren')).toHaveLength(3)
    addKeyValue()
    expect(wrap.state('stateChildren')).toHaveLength(4)
  })

  it('should add a AddKeyValueComponent if fieldType=map (and it should be at the end of the state children list)', () => {
    const currentValue = { x: 1, y: 2, deep: { deepX: 3 } }
    const lastLabelIndex = Object.keys(currentValue).length - 1
    const wrap = shallow(
      <Comp
        {...defaultProps}
        renderOutputTemplate
        fieldType="map"
        currentValue={currentValue}
      />,
    )

    expect(wrap.find('AddKeyValueField').exists()).toBe(true)
    expect(wrap.find('AddKeyValueField')).toHaveLength(1)
    expect(wrap.at(lastLabelIndex + 1).name()).toBe('AddKeyValueField')
  })

  it('should remove children from state and alter defaultTemplate on removeField and notify user that template has been changed', () => {
    const currentValue = { x: 1, y: 2, deep: { deepX: 3 } }
    const withoutX = { y: 2, deep: { deepX: 3 } }
    const onUpdate = jest.fn(() => {})
    const numFields = Object.keys(currentValue).length
    const wrap = mount(
      <Comp
        renderOutputTemplate
        onUpdate={onUpdate}
        fieldType="map"
        currentValue={currentValue}
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
    const currentValue = { x: 1, y: 2, deep: {} }
    const onUpdate = jest.fn(() => {})
    const wrap = mount(
      <Comp
        currentValue={currentValue}
        onUpdate={onUpdate}
      >
        <KeyValueField name="x" />
        <KeyValueField name="y" />
        <KeyValueField
          name="deep"
          valueComponent={<Comp fieldType="map" currentValue={{ defaultValue: 123 }} />}
        />
      </Comp>,
    )


    const deepValueField = wrap.findWhere(n => n.prop('name') === 'deep')
    const valueComponent = deepValueField.findWhere(n => n.prop('fieldType') === 'map')
    const { updateKeyValue } = valueComponent.instance()
    updateKeyValue('defaultValue', 'abc', 'defaultValue', 0)
    // 0 is the positionIndex of defaultValue within deep
    // (since defaultValue is the first, and only key in deep it has positionIndex of 0)
    expect(onUpdate).toHaveBeenCalledWith({
      x: 1,
      y: 2,
      deep: {
        defaultValue: 'abc',
      },
    })
  })

  it('should give positionIndex to all KeyValueField children', () => {
    const currentValue = {
      x: 1,
      y: 2,
      deep: {},
      other: 'a',
    }

    const wrap = mount(
      <Comp
        renderOutputTemplate
        currentValue={currentValue}
      >
        <KeyValueField name="x" />
        <KeyValueField name="y" />
        <KeyValueField
          name="deep"
          valueComponent={<Comp fieldType="map" renderOutputTemplate currentValue={{ defaultValue: 123 }} />}
        />
      </Comp>,
    )

    wrap.find('KeyValueField').forEach((elm) => {
      expect(typeof elm.prop('positionIndex')).toBe('number')
    })
  })

  it('should use prop components if provided', () => {
    const currentValue = { x: 1, y: 2, deep: { a: 'b' }, list: [''] }

    const customProp1 = 'cp1'
    const customProp2 = 'left'
    const customProp3 = <KeyValueField deletePosition="left" />
    const customKVC = <KeyValueField className={customProp1} />
    const customLFC = <ListField deletePosition={customProp2} />
    const customMFC = <MapField renderOutputTemplate keyValueComponent={customProp3} />


    const wrap = mount(
      <Comp
        renderOutputTemplate
        currentValue={currentValue}
        keyValueComponent={customKVC}
        listFieldComponent={customLFC}
        mapFieldComponent={customMFC}
      />,
    )


    const firstKVField = wrap.find('KeyValueField').first()
    expect(firstKVField.prop('className')).toBe(customProp1)
    expect(firstKVField.first().prop('className')).toBe(customProp1)

    const firstLField = wrap.find('ListField').first()
    let deleteFieldIndex = -1
    firstLField.find('div').first().children().forEach((child, ind) => {
      if (child.name() === 'DeleteField') deleteFieldIndex = ind
    })
    expect(firstLField.prop('deletePosition')).toBe(customProp2)
    expect(deleteFieldIndex).toBe(0)

    const firstMField = wrap.find('MapField').first()
    expect(firstMField.prop('keyValueComponent')).toBe(customProp3)
    expect(firstMField.find('AbstractEditor').prop('keyValueComponent')).toBe(customProp3)
    expect(firstMField.find('KeyValueField').prop('deletePosition')).toBe('left')
  })
})
