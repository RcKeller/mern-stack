import React from 'react'

import { Row, Col } from 'antd'

import Contact from './Contact/Contact'

const contactFields = [
  {
    role: 'primary',
    title: 'Primary Contact',
    subtitle: 'The primary lead and point-of-contact for this project.'
  }, {
    role: 'budget',
    title: 'Budget Director',
    subtitle: 'Contact for budgetary concerns and handling transfers of funds.'
  }, {
    role: 'organization',
    title: 'Organizational Head',
    subtitle: 'A departmental head or organization president to officiate this proposal.'
  }, {
    role: 'student',
    title: 'Student Lead',
    subtitle: '(Optional) We recommend that there be at least one student representing a project, as STF funds are intended for student use.'
  }
]

class Contacts extends React.Component {
  render () {
    return (
      <div>
        <h1>Contact Information</h1>
        <Row gutter={32}>
          {contactFields.map((c, i) => (
            <Col key={i} className='gutter-row' xs={24} md={12} lg={6} >
              <Contact key={i} {...c} />
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}

export default Contacts