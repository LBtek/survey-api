/* eslint-disable curly */
import { type Request } from 'express'

export const filterRequestData = (req: Request): void => {
  if (req.method === 'POST' || req.method === 'PUT')
    req.filteredData = { ...req.body, ...req.params }
  else if (req.method === 'GET')
    req.filteredData = { ...req.params, ...req.query }
  else
    req.filteredData = { }
}
