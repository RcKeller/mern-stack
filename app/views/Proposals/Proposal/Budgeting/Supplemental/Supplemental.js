import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../../services'
import { layout } from '../../../../../util/form'
import _ from 'lodash'

import { Form, Input, Alert, message } from 'antd'
const { TextArea } = Input
const FormItem = Form.Item
const connectForm = Form.create()

import { Boundary, Spreadsheet } from '../../../../../components'

/*
SUPPLEMENTAL TAB:
Available only to proposals w/ a previous award
Allows authors to request additional funding (unanticipated changes in model availability, etc)

This is a high churn component due to the confusing and
ever-changing nature of the process
*/
@compose(
  connect(
    (state, props) => ({
      proposal: state.db.proposal._id,
      //  Use the most recent report (target document) and recent manifest (initial data)
      manifest: state.db.proposal.manifests[props.indexInStore],
      existingSupplemmental: state.db.proposal.manifests
        .findIndex(m => m.type === 'supplemental') >= 0
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Supplemental extends React.Component {
  static propTypes = {
    //  the manifest index in store that is the basis for this supplemental.
    indexInStore: PropTypes.number.isRequired,
    form: PropTypes.object,
    api: PropTypes.object,
    proposal: PropTypes.string, //  _id
    manifest: PropTypes.object
  }
  componentDidMount () {
    const { form } = this.props
    form.validateFields()
  }
  handleSubmit = (items) => {
    let { form, api, proposal } = this.props
    //  Verify that the budget number (and hopefully other data) is there, add it to what we know.
    form.validateFields((err, values) => {
      if (!err) {
        items = items.map((item) => _.omit(item, ['_id', '__v']))
        let supplemental = { proposal, type: 'supplemental', items, ...values }
        const params = {
          populate: ['items'],
          transform: proposal => ({ proposal }),
          update: ({ proposal: (prev, next) => {
            let changed = Object.assign({}, prev)
            changed.manifests.push(next)
            return changed
          }})
        }
        api.post('manifest', supplemental, params)
        .then(message.success('Supplemental request submitted!'))
        .catch(err => {
          message.warning('Supplemental request failed - Unexpected client error')
          console.warn(err)
        })
      } else {
        message.warning('We need the budget number for charging to this budget.')
      }
    })
  }
  render ({ form, manifest, report, existingSupplemmental } = this.props) {
    //  Use the most recent approved manifest for initial data
    //  Make sure to omit mongo data, preventing the original from being mutated.
    let data = manifest.items
      ? manifest.items.map((item) =>
        _.omit(item, ['_id', '__v', 'manifest', 'description', 'priority', 'report']))
      : []
    return (
      <section>
        <Boundary title='Supplemental Request Wizard'>
          <Alert type='info' showIcon banner
            message='Request Supplemental'
            description={<div>
              <p>
                For proposals that face an unforseen and minor increase in budgetary needs.
              </p>
              <b>Important Delinitation: </b>
              <p>
                The STF Committee will not consider Supplemental requests which ask for funding and/or technology outside of the range of the original proposal. If you have underspent, submit a report instead.
              </p>
            </div>}
          />
          <p>
            Welcome to the Request Supplemental page. The purpose of a Supplemental is to request additional funding, additional technology, and/or modify specific details regarding the technology listed in the original proposal, <b>due to needs due to circumstances that could not have been reasonably anticipated.</b>

            We've copied all your proposal's items over into this new supplemental. Please use this pages to change items to reflect changes (or lack thereof) for all items initially funded, as well as add requests for additional technology.
          </p>
          <p><b>If you have underspent your award, there is no consequence - just complete a budget report and you're covered.</b></p>
          <p>
            Common acceptable reasons for a Supplemental request may include situations such as:
            <ul style={{
              listStyleType: 'circle',
              listStylePosition: 'inside'
            }}>
              <li>
                The cost of an item(s) changes due to unforeseen market changes
              </li>
              <li>
                Manufacturer discontinues item so an item of comparable capability is requested instead
              </li>
            </ul>
          </p>
          <p>
            Unacceptable reasons to ask for a supplemental may include:
            <ul style={{
              listStyleType: 'circle',
              listStylePosition: 'inside'
            }}>
              <li>
                Requests for additional technology outside the scope of the original project
              </li>
              <li>
                Requests for student labor
              </li>
              <li>
                Underspending of budget and subsequent request for multiples of item and/or more technology
              </li>
              <li>
                Reimbursement for items purchased from another budget
              </li>
            </ul>
          </p>
          <p>
            Once you submit, the committee will consider your proposal as soon as possible, usually by the next week's meeting.

            If you have additional questions, please contact the STF Proposal Officer at stfagent@uw.edu
          </p>
          <FormItem label='Request Title' {...layout} >
            {form.getFieldDecorator('title')(
              <Input disabled={existingSupplemmental} />
            )}
          </FormItem>
          <FormItem label='Reasoning' {...layout} >
            {form.getFieldDecorator('body')(
              <TextArea rows={6} disabled={existingSupplemmental} />
            )}
          </FormItem>
          <Spreadsheet
            data={data}
            onSubmit={this.handleSubmit}
            disabled={existingSupplemmental}
            prompt={
              !existingSupplemmental
                ? 'Finalize and Submit - Irreversible!'
                : 'We have received your supplemental request - please reach out to stfagent@uw.edu to schedule an appointment to discuss this.'
            }
          />
          {!existingSupplemmental &&
            <Alert type='error' showIcon banner
              message='You May Only Submit Once!'
              description='Submitting a request for supplemental funding notifies the STF admin team, formally kicking off the process. Like your original proposal, this is a one-time deal, and your request must be accurate and finalized.'
            />
          }
        </Boundary>
      </section>
    )
  }
}

export default Supplemental
