import { Router } from 'express'
import get from './get'

const router = Router()

router.get('/:id', [], get)

export default router
