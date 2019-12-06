const Closure = ({ closure }) => {
  if (closure) return (<script src="/comments.js"></script>)
  return (<script type="module" src="frontend/comments"></script>)
}

/**
 * @param {Object} opts
 * @param {Date} opts.date
 */
const Comment = ({ _id, isAuthor, name, photo, comment, date, github_user, linkedin_user }) => {
  return (<div className="comment">
    <strong>{name}</strong> on <em>{date.toLocaleString()}</em> {isAuthor && <a href="#">
      Remove
    </a>}
    <div style="display:table;">
      {photo && <div style="display:table-cell">
        <img src={photo} width="50" />
      </div>}
      <div style="display:table-cell">
        {comment}
      </div>
    </div>
  </div>)
}

/**
 * @type {import('../..').Middleware}
 */
export default async (ctx) => {
  const { CLOSURE, HOST } = ctx
  const { csrf, linkedin_user, github_user } = ctx.session

  const Comments = ctx.mongo.collection('comments')
  const comments = await Comments.find().limit(20).toArray()
  const cm = comments.map((comment) => {
    const { linkedin_user: l, github_user: g } = comment
    if (l && linkedin_user && l.id == linkedin_user.id) {
      comment.isAuthor = true
    } else if (g && github_user && github_user.html_url == g.html_url) {
      comment.isAuthor = true
    }
    return comment
  })
  // {cm.map(c => <Comment key={c._id} {...c} />)}
  // {cm.length && <hr/>}
  const App = (<div>

    <div id="preact" className="container"/>

    <script src="node_modules/preact/dist/preact.umd.js"/>
    <script>{`window.h = preact.h`}</script>

    <Closure closure={CLOSURE}/>

    <script type={CLOSURE ? undefined : 'module'}>
      {`window.comments({ host: '${HOST}' })`}
    </script>
  </div>)

  ctx.body = ctx.render(App, { title: 'Comments' })
}

// {user && <pre
//   dangerouslySetInnerHTML={{ __html:
//     JSON.stringify(ctx.session.user, null, 2) }} />}
// {user && <form action="/signout" method="post">
//   <input name="csrf" type="hidden" value={csrf} />
//   <button type="submit">Sign Out</button>
// </form>}
// {!user && <a href="/auth/linkedin">Sign In</a>}

export const middleware = ['session']