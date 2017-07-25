import React from 'react'
import PropTypes from 'prop-types'

// import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import api from '../../../services'

// import { Collapse } from 'antd'

import styles from './Docket.css'
@connect(state => ({ user: state.user }))
class Docket extends React.Component {
  render ({ user } = this.props) {
    return (
      <article className={styles['article']}>
        Placeholder - Docket
        Add proposals to docket.
        Determine Q/A or if voting.
      </article>
    )
  }
}
Docket.propTypes = {
  user: PropTypes.object
}
export default Docket
