import mongoose from 'mongoose'
import autoref from 'mongoose-autorefs'
import faker from 'faker'

/*
PROJECT SCHEMA:
This is the body or "Business Case" of a proposal - the business case.

Business cases are a new process for handling proposals.
They frame things as current vs. future state, so we evaluate
proposals framed as "changes" and "impact" on the community.

Legacy proposals are just a stream of Q/A, without any sort of structure
(totally flat), so to handle them we store the information in an array with
{ title: body }, then the client can use map() to render them.
*/
const ProjectSchema = new mongoose.Schema({
  /*
  There is no key to link to a proposal. We will never have to reverse engineer a proposal from its low level content.
  If that ever happens, implementing the relationship should be trivial.
  The overview contains high level details, the plan contains the actual strategy. These are separated so that the overview can be shown on weekly meeting dockets, and each part can be cut into components for rendering.
  */
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  overview: {
    abstract: String,
    //  Objectives are key notes/bullet points. Not stored in array for consistency.
    objectives: String,
    //  Justification is a brief answer to "why", or info about urgent need.
    justification: String,
    //  The impact on students in various aspects
    impact: {
      academic: String,
      research: String,
      career: String
    }
  },
  /*
  Projects are framed in the sense of current vs. fututre state.
  This is to reflect questions that consistently come up in QA sessions
  and the fact that our org evaluates proposals as "Changes" to the UW system.

  While very opionionated, a key part of the refresh site's UI is
  re-framing the proposal process to be comparative, and related data
  (e.g. current vs. future state) should be viewable side-by-side.
  */
  plan: {
    state: {
      current: String,
      future: String
    },
    availability: {
      current: String,
      future: String
    },
    strategy: {
      current: String,
      future: String
    },
    outreach: {
      current: String,
      future: String
    },
    risk: {
      current: String,
      future: String
    }
  },
  /*
  Legacy proposals are in a straightforward Q-A format, with a lot of inconsistency
  in our datasets. Our soultion for handling this is to collecting these is an array,
  then map() over them so they are rendered as a block of text, not unlike before the
  STF Refresh website. This is an elegant solution that prevents us from being opinionated
  about legacy proposals and requiring lots of join statements.

  To verify if a proposal is legacy or not, just use JS to test the truthiness
  of the legacy prop: if (proposal.legacy) {proposal.legacy.map((prompt, i)) => (...))}
  */
  legacy: [{
    title: String,
    body: String
  }]
})
ProjectSchema.plugin(autoref, ['proposal.body'])
const Project = mongoose.model('Project', ProjectSchema)
export default Project

/* *****
FAKE DATA GENERATOR: Contact
***** */
const dummyProjects = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Project.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Project schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Project({
          _id: ids.project[i],
          proposal: ids.proposal[i],
          overview: {
            abstract: faker.lorem.paragraph(),
            objectives: faker.lorem.paragraph(),
            justification: faker.lorem.paragraph(),
            impact: {
              academic: faker.lorem.paragraph(),
              research: faker.lorem.paragraph(),
              career: faker.lorem.paragraph()
            }
          },
          plan: {
            state: {
              current: faker.lorem.paragraph(),
              future: faker.lorem.paragraph()
            },
            availability: {
              current: faker.lorem.paragraph(),
              future: faker.lorem.paragraph()
            },
            strategy: {
              current: faker.lorem.paragraph(),
              future: faker.lorem.paragraph()
            },
            outreach: {
              current: faker.lorem.paragraph(),
              future: faker.lorem.paragraph()
            },
            risk: {
              current: faker.lorem.paragraph(),
              future: faker.lorem.paragraph()
            }
          },
          legacy: [
            {
              title: faker.company.catchPhrase(),
              body: faker.lorem.paragraph()
            },
            {
              title: faker.company.catchPhrase(),
              body: faker.lorem.paragraph()
            }
          ]
        })
      }
      //  Create will push our fakes into the DB.
      Project.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Project (${fakes.length})`) }
      })
    }
  })
}

export { dummyProjects }
