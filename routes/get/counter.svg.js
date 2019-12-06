import { makeElement } from '@svag/lib'
import Window from '@svag/window'

/**
 * @type {import('../..').Middleware}
 */
const counter = async (ctx) => {
  ctx.type = 'image/svg+xml'

  const client = ctx.client
  const { appName } = ctx

  const { aggregations: {
    distinct_ips: { value: count },
  } } = await client.search({
    type: 'hit',
    index: `${appName}-*`,
    body: {
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  // second version
                  // update this for exact pages
                  { match: { path: 'reflex.jpg' } },
                ],
              },
            },
            {
              bool: {
                should: [
                  { match: { status:  200 } },
                ],
              },
            },
            { match: { 'headers.referer':  '{{ name }}' } },
          ],
          must_not: [
            { match: { 'headers.from':  'googlebot' } },
          ],
        },
      },
      size: 0,
      aggs: {
        distinct_ips: {
          cardinality: {
            field: 'headers.x-forwarded-for.keyword',
          },
        },
      },
    },
  })
  const res = makeWindow(count)
  ctx.body = res
}

const makeWindow = (count) => {
  const line = makeElement('text', {
    attributes: {
      'font-family': 'Lucida Sans Typewriter,Lucida Console,monaco,Bitstream Vera Sans Mono,monospace',
      'font-size': '12px',
      x: 0,
      y: 10,
    },
    content: `$ ${count} people`,
  })
  const line2 = makeElement('text', {
    attributes: {
      'font-family': 'Lucida Sans Typewriter,Lucida Console,monaco,Bitstream Vera Sans Mono,monospace',
      'font-size': '12px',
      x: 0,
      y: 25,
    },
    content: 'have visited us',
  })

  const res = Window({
    title: 'Views',
    width: 165,
    height: 50,
    noStretch: true,
    content: [line, line2],
    noShadow: true,
  })
  return res
}

export default counter