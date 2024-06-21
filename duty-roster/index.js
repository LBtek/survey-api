const insertEmployees = require("./functions/insertEmployees.js")
const splitYear = require("./functions/splitYear.js")

function generateDuties(year, start, end, employees, bailiffs, vacation, vacationPO, lastDaysWorkedEmp, lastDaysWorkedPO) {
  const bail = new Set()
  const empl = new Set()
  
  bailiffs.forEach(b => bail.add(b))
  employees.forEach(e => empl.add(e))

  const entries = insertEmployees(splitYear(year, start, end), employees, lastDaysWorkedEmp, vacation, bail, empl, year)
  const entries2 = insertEmployees(splitYear(year, start, end), bailiffs, lastDaysWorkedPO, vacationPO, bail, empl, year)

  let arr = []

  entries.forEach((el, id) => {
    const month = el[0]
    let weeks = el[1]

    weeks = weeks.map((week, idx) => {
      const set = new Set()
      week.forEach((e, i) => {
        set.add(e.toString())
        set.add(entries2[id][1][idx][i].toString())
      })
      return { duty: Array.from(set) }
    })

    arr.push({ month, duties: weeks })
  })

  return { months: arr }
}

module.exports = generateDuties