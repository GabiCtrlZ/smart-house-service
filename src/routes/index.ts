import { Router } from 'express'
import agents from './agents'

const router = Router()

router.use('/agents', agents)

export default router
