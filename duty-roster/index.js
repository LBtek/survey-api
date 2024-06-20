const insertEmployees = require("./functions/insertEmployees.js")
const splitYear = require("./functions/splitYear.js")

function generateDuties(year, start, end, employees, bailiffs, vacation, vacationPO, lastDaysWorkedEmp, lastDaysWorkedPO) {
  const bail = new Set()
  const empl = new Set()
  
  bailiffs.forEach(b => bail.add(b))
  employees.forEach(e => empl.add(e))

  const entries = insertEmployees(splitYear(year, start, end), employees, lastDaysWorkedEmp, vacation, bail, empl, year)
  const entries2 = insertEmployees(splitYear(year, start, end), bailiffs, lastDaysWorkedPO, vacationPO, bail, empl, year)

  const obj = {}

  entries.forEach((el, id) => {
    const month = el[0]
    let weeks = el[1]

    weeks = weeks.map((week, idx) => {
      const set = new Set()
      week.forEach((e, i) => {
        set.add(e)
        set.add(entries2[id][1][idx][i])
      })
      return Array.from(set)
    })

    obj[month] = weeks
  })

  return obj
}

module.exports = generateDuties