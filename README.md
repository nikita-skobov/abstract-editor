# abstract-editor

Abstract Editor is a react component that gives you an abstract json editor with the components, and styling of your choosing.

My use case for making Abstract Editor is making a form where the structure of the form changes depending on the user's input.

## Installation
```sh
npm install --save abstract-editor
```

## Usage

Simple example:

```js
import React from 'react'
import {
  AbstractEditor,
} from 'abstract-editor'

export function MyComponent(props) {
  return (
    <AbstractEditor
      onUpdate={props.onUpdate}
      currentValue={{ key: 'value', mapKey: {}, listKey: ['some original value'] }}
      renderOutputTemplate
    />
  )
}
```

Will render a skeleton structure like this:

![ex1](./docs/ex1.JPG?raw=true "ex1")

If you click on the plus sign next to mapKey, you can expand the mapKey object
And add your own key/values to it.

![ex2](./docs/ex1-expanded.JPG?raw=true "ex1-expanded")

Any time any of the fields are update, the onUpdate function is called with the new root object. So in the above case, your last onUpdate call would have:

```js
{
  key: 'value',
  mapKey: {
    'user-key1': 'asd',
    'some other key': 'asdf',
  },
  listKey: [
    'some original value',
  ],
}
```

By default AbstractEditor does NOT render the current value provided. The reason for this is in case you want to have a current value that will be output no matter what the user inputs, and you want to include the user's inputs merged into your object structure. If you wish to render the currentValue, you must provide the `renderOutputTemplate` prop.

This of course is an ugly skeleton. You can pass your own children styled as you like. Here is a complex, but full example (this uses reactstrap and bootstrap css for styling):

```js
import React from 'react'
import {
  AbstractEditor,
  MapField,
  ListField,
  KeyValueField,
  Label,
} from 'abstract-editor'
import {
  Input,
  Col,
  Button,
  ButtonGroup,
} from 'reactstrap'

const mySep = () => <span style={{ width: '100%' }} />

const myValAuto = ({ onUpdate }) => <Col><Textarea minRows={2} className="form-control" onChange={onUpdate} /></Col>
const myValAutoText = ({ onUpdate }) => <Col><Textarea minRows={2} className="form-control" onChange={onUpdate} defaultValue="An example text item. You can use ${}$ syntax to substitute katex rendering. (NOTE: the contents within brackets must begin with a \). Here is an example: ${\color{red} \mu}$" /></Col>
const myValAutoFormula = ({ onUpdate }) => <Col><Textarea minRows={2} className="form-control" defaultValue="\LARGE \mu = \frac{\sum\limits_{\small i=1}^{\small N} x_i}{N}" onChange={onUpdate} /></Col>
const myVal = ({ onUpdate }) => <Col><Input type="text" onChange={onUpdate} /></Col>
const mySelect = ({ onUpdate }) => (
  <Col xs="auto">
    <Input onChange={onUpdate} type="select" name="select">
      <option />
      <option>A</option>
      <option>B</option>
    </Input>
  </Col>
)
const myDel = props => (
  <Button {...props} color="secondary" outline size="sm" type="button">X</Button>
)
const myDel2 = ({ onClick, onMove }) => (
  <ButtonGroup className="w-100 mt-1">
    <Button onClick={onClick} color="secondary" outline size="sm" type="button">Remove</Button>
    <Button color="secondary" outline size="sm" type="button" onClick={() => { onMove(1) }}>Move up</Button>
    <Button color="secondary" outline size="sm" type="button" onClick={() => { onMove(-1) }}>Move down</Button>
  </ButtonGroup>
)
const CustomAdd = p => (
  <Button className="editor-kvf-margin-small" outline block color="secondary" type="button" onClick={p.onUpdate}>Add {p.addType}</Button>
)
const myMap = props => (
  <Col>
    <MapField
      {...props}
      currentValue={{}}
      addKeyValueComponent={<CustomAdd fieldType="add-key-value" addType="Prerequisite" />}
      keyValueComponent={<KeyValueField keyComponent={myVal} valueComponent={mySelect} deleteComponent={myDel} className="no-gutters row editor-kvf-small" />}
    />
  </Col>
)

const kvForTextItem = (
  <KeyValueField
    keyComponent={noop}
    className="no-gutters row editor-kvf-small"
    valueComponent={myValAutoText}
    seperatorComponent={noop}
  />
)
const kvForFormulaItem = (
  <KeyValueField
    keyComponent={noop}
    className="no-gutters row editor-kvf-small"
    valueComponent={myValAutoFormula}
    seperatorComponent={noop}
  />
)

const mapForTextItem = (
  <MapField
    addKeyValueComponent={noop}
    renderOutputTemplate
    keyValueComponent={kvForTextItem}
  />
)

const mapForFormulaItem = (
  <MapField
    addKeyValueComponent={noop}
    renderOutputTemplate
    keyValueComponent={kvForFormulaItem}
  />
)

const myAdd1 = props => (
  <ButtonGroup className="w-100 mt-2">
    <Button outline onClick={() => { props.onUpdate({ text: 'An example text item. You can use ${}$ syntax to substitute katex rendering. (NOTE: the contents within brackets must begin with a \\). Here is an example: ${\\color{red} \\mu}$' }, mapForTextItem) }}>Add Text</Button>
    <Button outline onClick={() => { props.onUpdate({ formula: '\\LARGE \\mu = \\frac{\\sum\\limits_{\\small i=1}^{\\small N} x_i}{N}' }, mapForFormulaItem) }}>Add Formula</Button>
  </ButtonGroup>
)
const myList = props => (
  <ListField {...props} deleteItemComponent={myDel2} addItemComponent={myAdd1} wrapListComponent={<Col />} valueComponent={mapForTextItem} listItemClass="no-gutters row editor-kvf-small" currentValue={[]} />
)


export function MyComponent(props) {
  return (
      <AbstractEditor
        onUpdate={props.onUpdate}
        currentValue={{ name: '', description: '', prerequisites: {}, lesson: [] }}
        renderOutputTemplate
      >
        <KeyValueField
          name="name"
          className="no-gutters row editor-kvf"
          valueComponent={myVal}
          seperatorComponent={mySep}
        />
        <KeyValueField
          name="description"
          className="no-gutters row editor-kvf"
          seperatorComponent={mySep}
          valueComponent={myValAuto}
        />
        <KeyValueField
          name="prerequisites"
          className="no-gutters row editor-kvf"
          seperatorComponent={mySep}
          valueComponent={myMap}
        />
        <KeyValueField
          name="lesson"
          className="no-gutters row editor-kvf"
          seperatorComponent={mySep}
          valueComponent={myList}
        />
      </AbstractEditor>
  )
}

```

Which renders this:

![ex2](./docs/ex2.JPG?raw=true "ex2")

And when the user clicks the various buttons, it expands to this:

![ex2-expanded](./docs/ex2-expanded.JPG?raw=true "ex2-expanded")

