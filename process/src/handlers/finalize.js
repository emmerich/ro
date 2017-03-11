import { version } from '../../package.json'

export default (post) => Object.assign({}, post, {
  version,
})
