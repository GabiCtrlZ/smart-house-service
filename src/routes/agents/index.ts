import { Router } from 'express'
import get from './get'
import getAll from './get-all'
import create from './create'
import switchState from './switch'

const router = Router()

router.get('/:id', get)
router.get('/', getAll)
router.post('/', create)
router.post('/switch', switchState)

export default router
