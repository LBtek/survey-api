import env from '../../../main/config/env'

const sendRequest = async (port?: string | number, host?: string): Promise<void> => {
  const url = new URL(`http://localhost:${port || env.api.port}/api`)

  url.host = host || env.api.host

  const response = await fetch(url, {
    method: 'get'
  })

  if (response.status > 299) {
    console.error('[GET] Request to api "/" fails')
    process.exit(2)
  }

  const body = await response.json()

  console.log(body)
}

process.argv.forEach((arg, idx) => {
  if (arg === 'pipeline_action') {
    const port = process.argv[idx + 1]
    const host = process.argv[idx + 2]
    void sendRequest(port, host)
  }
})

export const checkServerIsOk = { sendRequest }
