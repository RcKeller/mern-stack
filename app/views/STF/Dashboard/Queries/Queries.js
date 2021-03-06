//  React and its typechecking
import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, Select, Input, Button, Icon, message } from 'antd'
const Option = Select.Option
const FormItem = Form.Item
const connectForm = Form.create()

import Inspector from 'react-json-view'
const config = {
  name: 'Query Results',
  collapsed: false,
  iconStyle: 'square',
  indentWidth: 4,
  displayDataTypes: false,
  displayObjectSize: true,
  collapseStringsAfterLength: 100,
  enableClipboard: true
}

import api from '../../../../services'
import { Loading } from '../../../../components'
import { Label } from '../../../../util/form'

import Examples from './Examples/Examples'

//  Legible names for DB models
const modelNames = {
  'Proposals': 'proposals',
  'Project Plans': 'projects',
  'Contacts': 'contacts',
  'Budgets': 'manifests',
  'Items': 'items',
  'Endorsements': 'comments',
  'Metrics': 'reviews',
  'Decisions': 'decisions',
  'Reports': 'reports',
  'Users': 'users',
  'Blocks': 'blocks'
}
//  Populates possible per model (not necessarily comprehensive)
const modelPopulates = {
  'proposals': ['body', 'contacts', 'manifests', 'comments'],
  'projects': ['proposal'],
  'contacts': ['proposal', 'block'],
  'manifests': ['proposal', 'report', 'items', 'reviews', 'decision'],
  'items': ['manifest', 'report'],
  'comments': ['proposal', 'user'],
  'reviews': ['proposal', 'manifest', 'author'],
  'decisions': ['proposal', 'manifest', 'author'],
  'reports': ['proposal', 'manifest', 'author', 'items'],
  'users': [],
  'blocks': ['contacts']
}

/*
QUERY VIEW:
Allows you to form querystrings run against the DB
The above enums map readable selectors to their actual operands
NOTE: This is very experimental and hard to support
You may want to gut this feature. It is a liability.
*/
@compose(
  connect(
    state => ({
      enums: state.config.enums,
      screen: state.screen,
      querytool: state.db.querytool || {}
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Queries extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    db: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = { model: 'proposals' }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount () {
    const { form } = this.props
    const { model } = this.state
    if (form && model) {
      form.setFieldsValue({ model })
    }
  }
  handleSelect (model) {
    this.setState({ model })
  }
  handleSubmit (e) {
    e.preventDefault()
    let { form, api } = this.props
    let { model } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        let { id, query, populate } = values
        //  Wrap querystrings in curly braces and parse.
        if (query) {
          try {
            query = JSON.parse(`{${query}}`)
          } catch (err) {
            message.warning('Invalid "Where" clause. Running the rest of the query. Example format: <published: true, quarter: "Autumn">', 10)
            query = undefined
          }
        }
        let params = {
          id,
          query,
          populate,
          transform: querytool => ({ querytool }),
          update: ({ querytool: (prev, next) => next })
        }
        api.getAsync(model, params)
      }
    })
  }
  render (
    { form, enums, screen, querytool } = this.props,
    { model } = this.state
  ) {
    if (window) {
      return (
        <div>
          <Examples />
          <br />
          <Form layout='inline' onSubmit={this.handleSubmit}>
            <FormItem label={<Label title='Model'
              message={'Models are document stores in the database - standalone records pulled together to generate site content.'} />} >
              {form.getFieldDecorator('model')(
                <Select
                  style={{ width: 230 }}
                  onChange={(m) => this.handleSelect(m)}
                >
                  {Object.keys(modelNames).map(k => (
                    <Option key={modelNames[k]} value={modelNames[k]}>
                      <span>{k} - <em>{modelNames[k]}</em></span>
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label={<Label title='ID'
              message={'The unique ID of a specific item you want to look up, like a draft ID. The DB assigns this as "_id" for every new document.'} />}
            >
              {form.getFieldDecorator('id')(
                <Input style={{ width: 200 }} />
              )}
            </FormItem>
            <FormItem label={<Label title='Where'
              message={'Find documents that match a set of conditions. Format: <"published": true, "quarter": "Autumn">'} />}
            >
              {form.getFieldDecorator('query')(
                <Input style={{ width: 200 }} />
              )}
            </FormItem>
            <FormItem label={<Label title='Join'
              message={'A Join ("Populate" in MongoDB) allows you to connect related documents on a shared field, usually a Universal Unique ID (UUID) that appears to be gibberish.'} />}
            >
              {form.getFieldDecorator('populate')(
                <Select mode='multiple' style={{ minWidth: 120 }}>
                  {modelPopulates[model].map(j => (
                    <Option key={j}>{j}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem>
              <Button size='large' type='primary' ghost
                htmlType='submit' disabled={!model}
              >
                <Icon type='api' />Run Query
              </Button>
            </FormItem>
          </Form>
          <br />
          <Loading render={window}
            title='Query Results'
            tip='Loading Querytool...\nThis will take some time'
          >
            <Inspector
              src={querytool}
              {...config}
            />
          </Loading>
        </div>
      )
    } else {
      return <div>Window not loaded</div>
    }
  }
}
export default Queries
