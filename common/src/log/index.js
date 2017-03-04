import { createLogger } from 'bunyan'
import PrettyStream from 'bunyan-prettystream'

export default () => {
  const prettyStdOut = new PrettyStream()
  prettyStdOut.pipe(process.stdout)

  return createLogger({
    name: 'reddit-outreach-process',
    streams: [
      {
        level: 'trace',
        type: 'raw',
        stream: prettyStdOut
      }
    ]
  })
}
