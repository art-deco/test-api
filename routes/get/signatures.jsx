const Closure = ({ closure }) => {
  if (closure) return (<script src="/signature.js"></script>)
  return (<script type="module" src="frontend/signature"></script>)
}

/**
 * @type {import('../..').Middleware}
 */
export default async (ctx) => {
  const { CLOSURE, HOST } = ctx
  const { linkedin_user, github_user } = ctx.session

  // const Comments = ctx.mongo.collection('ments')
  // const comments = await Comments.find().limit(20).toArray()
  // const cm = comments.map((comment) => {
  //   const { linkedin_user: l, github_user: g } = comment
  //   if (l && linkedin_user && l.id == linkedin_user.id) {
  //     comment.isAuthor = true
  //   } else if (g && github_user && github_user.html_url == g.html_url) {
  //     comment.isAuthor = true
  //   }
  //   return comment
  // })
  // {cm.map(c => <Comment key={c._id} {...c} />)}
  // {cm.length && <hr/>}
  const App = (<div>

    <div id="preact" className="container"/>

    <script type="module">
      {`import { h } from '/node_modules/preact/src/preact'; window.h = h`}
    </script>
    <script type="module" src="node_modules/preact/devtools/"/>

    <Closure closure={CLOSURE}/>

    <script type={CLOSURE ? undefined : 'module'}>
      {`window.comments({ host: '${HOST}' })`}
    </script>
  </div>)

  ctx.body = ctx.render(App, { title: 'Comments' })
}

{/* <script>{`window.h = preact.h`}</script> */}

{/* <script src="node_modules/preact/dist/preact.umd.js"/> */}


// {user && <pre
//   dangerouslySetInnerHTML={{ __html:
//     JSON.stringify(ctx.session.user, null, 2) }} />}
// {user && <form action="/signout" method="post">
//   <input name="csrf" type="hidden" value={csrf} />
//   <button type="submit">Sign Out</button>
// </form>}
// {!user && <a href="/auth/linkedin">Sign In</a>}

export const middleware = ['session']