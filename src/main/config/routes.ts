/* eslint-disable n/no-path-concat */
import { type Express, Router } from 'express'
import { readdirSync } from 'fs'

const generateDuties = require('../../../duty-roster/index.js')

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
    /* istanbul ignore next */
  router.post('/duty', (req, res) => {
    if (
      req.body &&
      req.body.dates &&
      req.body.employees &&
      req.body.bailiffs &&
      req.body.vacationsEmp &&
      req.body.vacationsPO
    ) {
      const { dates, employees, bailiffs, vacationsEmp, vacationsPO } = req.body

      const lastDayWorkedEmp = {}
      const lastDayWorkedPO = {}
      const bail = new Set()
      const empl = new Set()
      
      employees.forEach(e => {
        lastDayWorkedEmp[e] = 0
        empl.add(e)
      })
      bailiffs.forEach(b => {
        lastDayWorkedPO[b] = 0
        bail.add(b)
      })
  
      const startDate = new Date(dates.startDate).getDate() + '-' + (new Date(dates.startDate).getMonth()+1)
      const endDate = new Date(dates.endDate).getDate() + '-' + (new Date(dates.endDate).getMonth()+1)
  
      const duties = generateDuties(dates.year, startDate, endDate, employees, bailiffs, vacationsEmp, vacationsPO, lastDayWorkedEmp, lastDayWorkedPO)
  
      res.json(duties)
    } else res.status(400).send()
  })

  readdirSync(`${__dirname}/../routes`).map(async file => {
    if (!file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
  router.get('/', (req, res) => {
    res.json('ok')
  })
}
