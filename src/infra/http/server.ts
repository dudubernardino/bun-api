import { Elysia } from 'elysia'
import { userRoutes } from './routes/users/routes'

const app = new Elysia().use(userRoutes)

app.listen(3333, () => {
  console.log('HTTP server running!')
})
