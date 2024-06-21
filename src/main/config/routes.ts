/* eslint-disable n/no-path-concat */
import { type Express, Router } from 'express'
import { readdirSync } from 'fs'

const month = {
  '1': 'janeiro',
  '2': 'fevereiro',
  '3': 'março',
  '4': 'abril',
  '5': 'maio',
  '6': 'junho',
  '7': 'julho',
  '8': 'agosto',
  '9': 'setembro',
  '10': 'outubro',
  '11': 'novembro',
  '12': 'dezembro',
}

const generateDuties = require('../../../duty-roster/index.js')

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
    /* istanbul ignore next */
  router.post('/duty', (req, res) => {
    console.log(req.body)
    if (
      req.body &&
      req.body.dates &&
      req.body.employees &&
      req.body.bailiffs &&
      req.body.vacationsEmp &&
      req.body.vacationsPO
    ) {
      const { dates, employees, bailiffs } = req.body

      const vacationsEmp = {}
      const vacationsPO = {}

      req.body.vacationsEmp.forEach((emp) => {
        vacationsEmp[emp.name] = []
        emp.absences?.forEach((abs) => {
          const vacation = {}
          const start = new Date(abs.start_date)
          const end = new Date(abs.end_date)
          vacation['startDay'] = start.getDate()
          vacation['startMonth'] = month[(start.getMonth()+1).toString()]
          vacation['endDay'] = end.getDate()
          vacation['endMonth'] = month[(end.getMonth()+1).toString()]
          vacationsEmp[emp.name].push(vacation)
        })
      })

      req.body.vacationsPO.forEach((po) => {
        vacationsPO[po.name] = []
        po.absences?.forEach((abs) => {
          const vacation = {}
          const start = new Date(abs.start_date)
          const end = new Date(abs.end_date)
          vacation['startDay'] = start.getDate()
          vacation['startMonth'] = month[(start.getMonth()+1).toString()]
          vacation['endDay'] = end.getDate()
          vacation['endMonth'] = month[(end.getMonth()+1).toString()]
          vacationsPO[po.name].push(vacation)
        })
      })

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
