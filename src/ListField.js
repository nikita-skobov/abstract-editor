import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Label from './Label'
import AddListItem from './AddKeyValueField'
import DeleteField from './DeleteField'
import { makeReactObject } from './utils'

const propTypes = {
  onUpdate: PropTypes.func,

  valueComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),
  addItemComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),
  deleteItemComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),
  deletePosition: PropTypes.oneOf(['left', 'right']),

  // eslint-disable-next-line
  startingItem: PropTypes.any,

  currentValue: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ])),
}

const defaultProps = {
  currentValue: [],
  startingItem: '',
  deletePosition: 'right',
  onUpdate: () => {},
  valueComponent: Label,
  addItemComponent: AddListItem,
  deleteItemComponent: DeleteField,
}

export default class ListField extends Component {
  constructor(props) {
    super(props)
    this.keyCounter = 0
    this.outputList = []

    this.addItemFunc = this.addItemFunc.bind(this)
    this.fillWithKey = this.fillWithKey.bind(this)
    this.itemUpdated = this.itemUpdated.bind(this)
    this.itemDeleted = this.itemDeleted.bind(this)

    const {
      valueComponent,
      addItemComponent,
      deleteItemComponent,
    } = props
    this.ValueComponent = makeReactObject(valueComponent)
    this.AddItemComponent = makeReactObject(addItemComponent)
    this.DeleteItemComponent = makeReactObject(deleteItemComponent)

    const { props: VCProps } = this.ValueComponent
    if (VCProps.fieldType === 'map') {
      this.nextItem = {}
    } else {
      this.nextItem = ''
    }

    const list = []

    const startingList = props.currentValue
    startingList.forEach((elm) => {
      this.outputList.push(elm)
      list.push(this.fillWithKey(this.ValueComponent, {
        currentValue: elm,
      }))
    })

    list.push(this.fillWithKey(this.AddItemComponent, {
      onUpdate: this.addItemFunc,
      fieldType: 'add-item',
    }))


    this.state = {
      list,
    }
  }

  fillWithKey(comp, props = {}) {
    const newComp = React.cloneElement(comp, {
      ...props,
      key: this.keyCounter.toString(),
    })
    this.keyCounter += 1
    return newComp
  }

  itemUpdated(nv, pos) {
    const { target } = nv
    const newval = target ? target.value : nv
    this.outputList[pos] = newval

    const { onUpdate } = this.props
    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate([...this.outputList])
    }
  }

  itemDeleted(pos) {
    this.outputList.splice(pos, 1)
    const { onUpdate } = this.props
    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate([...this.outputList])
    }

    this.setState((prevState) => {
      const newState = prevState
      const { list } = prevState
      const modifiableChildren = [...list]
      modifiableChildren.splice(pos, 1)
      // the component that calls this callback function knows
      // its positionIndex via a prop. it uses that position index
      // to let this component know which element to remove
      // from the state list array.
      newState.list = modifiableChildren
      return newState
    })
  }

  addItemFunc() {
    this.setState((prevState) => {
      const { list } = prevState
      const lastChild = list[list.length - 1]
      const firstNChildren = list.slice(0, list.length - 1)

      const nextChild = this.fillWithKey(this.ValueComponent, {
        currentValue: this.nextItem,
      })

      this.outputList.push(this.nextItem)
      const newChildren = [...firstNChildren, nextChild, lastChild]
      const newState = { list: newChildren }
      return newState
    })
  }

  render() {
    const { list } = this.state
    const { deletePosition } = this.props


    const output = []
    list.forEach((item, ind) => {
      const { props } = item
      if (props && props.fieldType === 'add-item') {
        output.push(item)
      } else {
        const it = React.cloneElement(item, {
          onUpdate: (nv) => { this.itemUpdated(nv, ind) },
        })
        const del = React.cloneElement(this.DeleteItemComponent, {
          onClick: () => { this.itemDeleted(ind) },
        })

        const delLeft = deletePosition === 'left' ? del : null
        const delRight = deletePosition === 'right' ? del : null

        output.push(
          <div key={item.key}>
            {delLeft}
            {it}
            {delRight}
          </div>,
        )
      }
    })
    return output
  }
}

ListField.propTypes = propTypes
ListField.defaultProps = defaultProps
