import type Elysia from 'elysia'
import { findById } from './find-by-id'

export const userRoutes = (app: Elysia) => app.get('/users/:id', ({ params }) => findById(params.id))
