import { map } from 'ramda'

const falseyToUndefined = (value) => value || undefined

export default (post) => map(falseyToUndefined, post)
