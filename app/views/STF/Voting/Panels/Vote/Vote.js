import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../../util/form'
import api from '../../../../../services'

import { Spin, Form, Row, Col, Switch, Slider, InputNumber, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

@compose(
  connect(
    (state, props) => ({
      active: state.db.manifests
        .find(manifest => manifest._id === props.id)
        .docket.metrics,
      proposal: state.db.manifests
        .find(manifest => manifest._id === props.id)
        .proposal._id,
      manifest: state.db.manifests
        .find(manifest => manifest._id === props.id),
      review: state.db.manifests
        .find(manifest => manifest._id === props.id)
        .reviews
        .find(review => review.author._id === state.user._id) || {},
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Vote extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    id: PropTypes.string.isRequired,
    proposal: PropTypes.string,
    manifest: PropTypes.object,
    review: PropTypes.object,
    user: PropTypes.object
  }
  componentDidMount () {
    const { form, review } = this.props
    if (form && review) {
      //  Consistent fields
      const { approved } = review
      form.setFieldsValue({ approved })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, proposal, manifest, review, user } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.warn('Submitting', values)
        const { approved } = values
        const submission = {
          proposal,
          manifest: manifest._id,
          author: user._id,
          approved
        }
        /*
        Transform res and update manifest props
        */
        // const transform = res => ({})
        console.warn('Review', submission)
        //  TODO: Add custom update func
        review._id
          ? api.patch('review', submission, { id: review._id })
          .then(message.success('Review updated!'), 10)
          .catch(err => {
            message.warning('Review failed to update - Unexpected client error')
            console.warn(err)
          })
          : api.post('review', submission)
          .then(message.success('Review posted!'))
          .catch(err => {
            message.warning('Review failed to post - Unexpected client error')
            console.warn(err)
          })
      }
    })
  }
  render (
    { form, active, manifest, user, questions } = this.props
  ) {
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <Form onSubmit={this.handleSubmit}>
            <h2>Your Final Vote</h2>
            <h6>For internal use only.</h6>
            <FormItem label={<b>Final Vote</b>} {...layout}>
              {form.getFieldDecorator('approved', { valuePropName: 'checked' })(
                //  Valueprop is a selector for antd switches, it's in the docs.
                <Switch checkedChildren='APPROVE' unCheckedChildren='DENY' />
              )}
            </FormItem>
            <FormItem label='Submit' {...layout}>
              <Button size='large' type='primary'
                htmlType='submit' ghost disabled={!active}
                >Update your Review</Button>
            </FormItem>
          </Form>
          }
      </section>
    )
  }
}

export default Vote