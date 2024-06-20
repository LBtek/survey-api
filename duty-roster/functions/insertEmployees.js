const { months, month:mnth } = require("../helpers/helpers.js")

let employee = 0, count = 0, crash = false, beforeEmployees = []

let consecutiveVacationEmployee = new Set()

function update(employees, lastDaysWorkedEntries) {
  const notWorkedOnDuty = lastDaysWorkedEntries.filter(emp => emp[1] === 0)
  if (notWorkedOnDuty?.length) {
    if (!consecutiveVacationEmployee.has(notWorkedOnDuty[0][0])) {
      consecutiveVacationEmployee.add(notWorkedOnDuty[0][0])
      employee = employees.indexOf(notWorkedOnDuty[0][0])
    } else {
      const before = employees[employee]
      const minEmp = oldestShift(lastDaysWorkedEntries, employees)
      if (minEmp === before) {
        const lastDaysWorkedEntries2 = lastDaysWorkedEntries.filter(e => e[0] !== minEmp)
        update(employees, lastDaysWorkedEntries2)
      }
    }
  } else {
    if (lastDaysWorkedEntries.length) 
      oldestShift(lastDaysWorkedEntries, employees)
    else if (employee === employees.length - 1) 
      employee = 0
    else employee++
  }
}

function oldestShift(entries, employees) {
  let len = entries.length
  if (len) {
    let minEmp
    let min = 99999
    while( len-- ) {
      if ( entries[len][1] < min && !consecutiveVacationEmployee.has(entries[len][0]) ) {
        min = entries[len][1]
        minEmp = entries[len][0]
      }
    }
    employee = employees.indexOf(minEmp)
    return minEmp
  }
}

function isOn(startMonth, endMonth, startDay, endDay, month, week, employees, vacations, lastDaysWorkedEntries, bail, empl, year) {
  const week0 = week[0]
  const week1 = week[1] || week0

  let start = startDay
  let end

  if ( startMonth === month && endMonth === month ) {     
    end = endDay
  }
  else if ( startMonth === month ) {
    end = new Date(year, months[month], 0).getDate()
  }
  else if ( endMonth === month ) {
    start = 1
    end = endDay
  } 
  else if ( mnth[parseInt(months[startMonth]) + 1] === month && mnth[months[endMonth] - 1] === month ) {
    start = 1
    end = new Date(year, months[month], 0).getDate()
  } 
  else {
    return
  }

  if (         
    (start >= week0 && start <= week1) ||
    (end >= week0 && start <= week0)   
  ) {
    beforeEmployees.push(employee)
    if ( lastDaysWorkedEntries.every(emp => emp[1] > 0) ) {
      const minEmp = oldestShift(lastDaysWorkedEntries, employees)
      const lastDaysWorkedEntries2 = lastDaysWorkedEntries.filter(e => e[0] !== minEmp)
      oldestShift(lastDaysWorkedEntries2, employees)

      if (!beforeEmployees.includes(employee)) 
        isOnVacation(month, week, vacations, employees, lastDaysWorkedEntries2, bail, empl, year)
      else 
        crash = true

    } else {
      consecutiveVacationEmployee.add(employees[employee])
      update(employees, lastDaysWorkedEntries)
      if (!beforeEmployees.includes(employee)) {
        isOnVacation(month, week, vacations, employees, lastDaysWorkedEntries, bail, empl, year)
        consecutiveVacationEmployee = new Set()
      }
      else 
        crash = true
    }
    beforeEmployees = []
  }
}

function getStartDay(startMonth, employeeName, vacation, bail, empl, year) {
  let subDays = 0

  if (bail.has(employeeName)) 
    subDays = 6
  else if (empl.has(employeeName))
    subDays = 1

  let newStartDay = vacation.startDay - subDays

  if (newStartDay <= 0) {
    let newStartMonth = months[startMonth] - 1
    let yearStartVacation = year

    if (newStartMonth <= 0) {
      newStartMonth = 12
      yearStartVacation = year - 1
    } 
    const lastDayMonth = new Date(yearStartVacation, newStartMonth, 0).getDate()
    newStartDay = lastDayMonth + newStartDay

    return { startMonth: mnth[newStartMonth], startDay: newStartDay }
  }
  return { startMonth, startDay: newStartDay }
}

function isOnVacation(month, week, vacations, employees, lastDaysWorkedEntries, bail, empl, year) {
  const beforeEmp = employees[employee] 
  const employeeVacation = vacations[employees[employee]]
  let len = employeeVacation?.length || null
  
  if ( len ) {
    for (let i = 0; i < len; i++) {
      if (!week) continue
      const vacation = employeeVacation[i]     
      const start = getStartDay(vacation.startMonth, employees[employee], vacation, bail, empl, year)
      const { startMonth } = start
      const { startDay } = start
      const endMonth = vacation.endMonth
      const endDay = vacation.endDay 

      isOn(startMonth, endMonth, startDay, endDay, month, week, employees, vacations, lastDaysWorkedEntries, bail, empl, year)

      if (employees[employee] !== beforeEmp) break
    }
  }
}

let repeated

async function addEmployeeOnDutyWeek(month, week, nextWeek, employees, vacations, lastDaysWorked, lastDaysWorkedEntries, bail, empl, year) {
  let weekNumberDays
  let week1 = week[1] || week[0]
  if (week.length === 2)
    weekNumberDays = (week1 - week[0]) + 1
  else 
    weekNumberDays = 1

  if ( weekNumberDays === 7 ) {
    isOnVacation(month, week, vacations, employees, lastDaysWorkedEntries, bail, empl, year)
    if (crash) {
      week.push('-----')
      crash = false
    } else {
      week.push(employees[employee])
      lastDaysWorked[employees[employee]] = parseInt(months[month] + '' + (week1 < 10 ? `0${week1}` : week1))
      consecutiveVacationEmployee = new Set()
    }
    const entries = Object.entries(lastDaysWorked)
    update(employees, entries)
  } 
  else if ( count === 1 ) {
    count = 0
    week.push(repeated)
    if (crash) crash = false
    else {
      lastDaysWorked[repeated] = parseInt(months[month] + '' + (week1 < 10 ? `0${week1}` : week1))
      consecutiveVacationEmployee = new Set()
    } 
    const entries = Object.entries(lastDaysWorked)
    update(employees, entries)
  } 
  else {
    isOnVacation(month, week, vacations, employees, lastDaysWorkedEntries, bail, empl, year)
    isOnVacation(month, nextWeek, vacations, employees, lastDaysWorkedEntries, bail, empl, year)
    if (crash) repeated = '-----'
    else repeated = employees[employee]
    week.push(repeated)
    count++
  }
}

function insertEmployees(yearSplited, employees, lastDaysWorked, vacations, bail, empl, year) {
  const entries = Object.entries(yearSplited)
  let fullcicle = false

  for( let i = 0; i < entries.length; i++ ) {
    const month = entries[i][0].toLowerCase()
    let weeks = entries[i][1]

    for( let j = 0; j < weeks.length; j++ ) {
      const entries = Object.entries(lastDaysWorked)
      if ( fullcicle ) {
        oldestShift(entries, employees)
        addEmployeeOnDutyWeek(month, weeks[j], weeks[j+1], employees, vacations, lastDaysWorked, entries, bail, empl, year)
      } 
      else {
        addEmployeeOnDutyWeek(month, weeks[j], weeks[j+1], employees, vacations, lastDaysWorked, entries, bail, empl, year)
        fullcicle = Object.values(lastDaysWorked).every(e => e > 0)
      }
    }
  }

  employee = 0
  count = 0

  return entries
}

module.exports = insertEmployees