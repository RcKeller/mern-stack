/*
Services include logic that is independent from the component level.
This includes things like authentication, etc.
Logic coupled with a component should be in the respective duck.
In essense, these are "getters" framed in the sense of a feature/service that
isn't coupled with a specific view.
*/

export { default as authentication } from './authentication'
