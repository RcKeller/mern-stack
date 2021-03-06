import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Boundary } from '../../../../components'

import { Alert } from 'antd'

import Endorse from './Endorse/Endorse'
import Endorsement from './Endorsement/Endorsement'

/*
ENDORSEMENTS TAB:
Renders a list of user endorsements
Endorsement submissions are closed once decisions are issued
*/
@connect(state => ({
  proposalID: state.db.proposal._id,
  endorsements: state.db.proposal.comments,
  endorsed: state.db.proposal.comments
    .some(endorsement =>
      endorsement.user === state.user._id ||
      endorsement.user._id === state.user._id
    ),
  decisionIssued: state.db.proposal.manifests
    .findIndex(m => m.decision && typeof m.decision.approved === 'boolean') >= 0,
  user: state.user,
  screen: state.screen
}))
class Endorsements extends React.Component {
  static propTypes = {
    endorsements: PropTypes.array
  }
  render ({ endorsements, endorsed, decisionIssued, user } = this.props) {
    return (
      <Boundary title='Endorsements Tab'>
        <Alert showIcon
          type={!endorsed ? 'info' : 'success'}
          message={!endorsed
            ? 'Community Endorsements'
            : 'You have endorsed this proposal!'
          }
          description={!endorsed &&
            'Anyone with a UW NetID can endorse a proposal! We highly encourage our proposal authors to exemplify their community engagement by having their proposals endorsed by students and staff alike. You may endorse as many proposals as you like.'
          }
        />
        {!endorsed && !decisionIssued && <Endorse />}
        {endorsements.map((comment, i) => (
          <div key={i}>
            <Endorsement {...comment} />
          </div>
        ))}
      </Boundary>
    )
  }
}

export default Endorsements
