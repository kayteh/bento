import Transport from '../transport'
import Bento, { JSONSerializer } from '..'

const evt: {
  _snd?: InMemoryTransport,
  _rcv?: InMemoryTransport,
  send: (data: ArrayBuffer) => Promise<ArrayBuffer>
} = {
  send: (data: ArrayBuffer) => {
    if (evt._rcv === undefined) {
      throw new Error('oops')
    }

    return evt._rcv.receiver({ buffer: data, ctx: { env: 'testing' } })
  }
}

export class InMemoryTransport extends Transport {
  sender (data: ArrayBuffer): Promise<ArrayBuffer> {
    return evt.send(data)
  }
}

export const createClient = (b: Bento) => {
  evt._snd = new InMemoryTransport(b, new JSONSerializer())
  return evt._snd
}

export const createServer = (b: Bento) => {
  evt._rcv = new InMemoryTransport(b, new JSONSerializer())
  return evt._rcv
}
