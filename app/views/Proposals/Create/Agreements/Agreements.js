import React from 'react'

import { Row, Col, Alert } from 'antd'

/*
Agreement Component:
Renders a policy alert box with links
Map these to create giant angry walls of legal text.
*/
class Agreement extends React.Component {
  agreements = {
    important: [
      {
        link: 'https://uwstf.org/docs/Policy/Compliance%20Policy.pdf',
        title: 'Compliance Policy',
        description: 'The STFC retains control over items under $50,000 for 3 years, and items above for 7 years. The STFC is the owner of all purchased technology for that oversight period. The STFC may request transfer, return, or other actions for the items pruchased. The STFC may take punitive actions against non-complying organizations. All future policy changes apply retroactively to previously funded technologies.'
      }, {
        link: 'https://uwstf.org/docs/Decisions/Adobe%20No-Purchase%20Decision.pdf',
        title: 'Adobe No-Purchase Decision',
        description: 'The STFC will not accept proposals for Adobe products unless a comprehensive campus agreement is crafted'
      }
    ],
    standard: [
      {
        link: 'https://uwstf.org/docs/Policy/Consumables%20Policy.pdf',
        title: 'Consumables Policy',
        description: 'Consumables, such as ink, resin, or paper may be charged for. Charges may only cover the cost of the materials. The STFC will not normally provide for consumables'
      }, {
        link: 'https://uwstf.org/docs/Policy/Marketing%20Policy.pdf',
        title: 'Marketing Policy',
        description: 'Funded items, websites, created goods, and other resources are to feature the STF logo. The STF will provide stickers and vector images'
      }, {
        link: 'https://uwstf.org/docs/Decisions/Wireless%20Access%20No-Purchase%20Decision.pdf',
        title: 'Wireless Internet No-Purchase Decision',
        description: 'The STFC considers wireless internet access a utility and will therefore not purchase any related infrastructure'
      }, {
        link: 'https://uwstf.org/docs/Policy/Accessibility%20Policy.pdf',
        title: 'Accessibility Policy',
        description: 'Departments must keep access open to their funded resources as much as possible. All students paying the STF are expected access. Changes to resource access requires STFC approval'
      }, {
        link: 'https://uwstf.org/docs/Policy/supplemental%20Policy.pdf',
        title: 'Supplemental Policy',
        description: 'Sometimes prices and plans change; the STFC will hear changes to previously funded proposals for one year after the original funds were allocated'
      }, {
        link: 'https://uwstf.org/docs/Findings/Departmental%20Technology%20Obligation%20Finding.pdf',
        title: 'Departmental Technology Obligation Finding',
        description: 'The STFC expects departments to provide technology that is required for their students\' education. The STFC will not cover basic technological needs'
      }
    ]
  }
  render (
    { agreements: { important, standard } } = this
  ) {
    return (
      <div>
        {important.map((policy, i) => (
          <Alert key={i} type='error' banner showIcon={false}
            description={policy.description}
            message={
              <a href={policy.link} target='_blank'>{policy.title}</a>
            }
          />
        ))}
        <Row gutter={16}>
          {standard.map((policy, i) => (
            <Col key={i} className='gutter-row' xs={24} sm={12} md={8} lg={6} xl={4}>
              <Alert type='warning' banner showIcon={false}
                description={policy.description}
                message={
                  <a href={policy.link} target='_blank'>{policy.title}</a>
                }
              />
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}

export default Agreement
