/**
 * @type {Template}
 */
const config = {
  files: {
    filenames(a) {
      return [...a, 'CNAME']
    },
  },
  questions: {
    title: {
      text: 'Website Title',
    },
    hostname: {
      text: 'Hostname',
      getDefault ({ name }) {
        return name
      },
      alias: 'https://mnpjs.github.io/idio/',
      afterQuestions(_, hostname) {
        return {
          hostname,
          url: hostname,
        }
      },
    },
    frontend: {
      text: 'Frontend',
      getDefault ({ name }) {
        return name
      },
    },
  },
  async afterInit({ org, name }, { git, loading, github }) {
    await loading('Enabling Pages on docs', github.pages.enable(org, name))
    await git(['rm', '--cached', '.env', '.settings'])
    await git(['commit', '-am', 'ignore settings'])
  },
}

export default config

/**
 * @typedef {import('mnp').Template} Template
 */