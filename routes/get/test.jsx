/**
 * @type {import('../..').Middleware}
 */
export default async (ctx) => {
  const App = (<div>
    <script type="module">
      {`import { h } from '/node_modules/preact/src/preact'; window.h = h`}
    </script>
    <script type="module" src="/frontend/test"/>
  </div>)

  ctx.body = ctx.render(App)
}