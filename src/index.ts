import {
  IBentoTransport,
  IBentoSerializer,
  BentoRequestData,
  BentoResponseData,
  BufferWithCtx
} from './types'
import camelCase from 'camel-case'

export { default as JSONSerializer } from './serializers/json'
export { default as Transport } from './transport'

type BentoCtx<C> = C | {
  bento: Bento
}
type Constructor<T> = {
  new(b: Bento): T
}

// type Serializer = Constructor<IBentoSerializer>
// type Transport = Constructor<IBentoTransport>

type Client<T> = {
  new(b: Bento, tt?: IBentoTransport): T
  __SERVICE__: string
}
type Service<T> = Constructor<T>

export default class Bento {
  public transport?: IBentoTransport
  public serviceRegistry: Map<string, any> = new Map()

  /**
   * makes this bento instance able to respond to a service definition's rpcs.
   * @param name service name
   * @param impl service implmentation
   */
  service<T> (name: string | (() => string), impl: Service<T>) {
    if (typeof name === 'function') {
      name = name()
    }

    const service = new impl(this)
    this.serviceRegistry.set(name, service)
  }

  /**
   * creates a client
   * @param impl client class implementation
   * @param tt optional transport for sending data
   */
  client<T> (impl: Client<T>, tt?: IBentoTransport): T {
    return new impl(this, tt)
  }

  /**
   * make a request over supplied or default transport
   * @param transport optional transport
   * @param service service name
   * @param fn rpc function name
   * @param input input data
   */
  async makeRequest<I, O> (transport: IBentoTransport | undefined, service: string, fn: string, input: I): Promise<O> {
    if (transport === undefined) {
      transport = this.transport
      if (transport === undefined) {
        throw new Error('Bento: no transport')
      }
    }

    // if we know about it, we'll bypass the full flow
    if (this.serviceRegistry.has(service)) {
      return this.call({ service, fn, input, ctx: { local: true } })
    }

    // serialize
    const reqBuf = transport.serializer.serialize({
      service,
      fn,
      input
    })
    // trigger transport output, await
    const respBuf = await transport.sender(reqBuf, { service, fn })
    // deserialize
    const resp: BentoResponseData<O> = transport.serializer.deserialize(respBuf)

    if (resp.error === true) {
      throw new Error(resp.errorMsg)
    }

    return resp.response
  }

  /**
   * recieve a request from a client
   * @param buf buffer with contextual data attached (e.g. an http handler like koa)
   */
  async receiveRequest<I, O, C> (buf: BufferWithCtx<C>, serializer: IBentoSerializer): Promise<ArrayBuffer> {
    const req: BentoRequestData<I, C> = serializer.deserializeRequest(buf)

    try {
      const respData = await this.call<I, O, C>(req)
      const respBuf = serializer.serialize({
        response: respData
      })
      return respBuf
    } catch (e) {
      const respBuf = serializer.serialize({
        error: true,
        errorMsg: e
      })
      return respBuf
    }
  }

  call<I, O, C> (req: BentoRequestData<I, C>): Promise<O> {
    const { service, input, ctx } = req
    if (!this.serviceRegistry.has(service)) {
      throw new Error(`Bento: service name ${service} not registered.`)
    }

    const svc: { [x: string]: (ctx: BentoCtx<C>, input: I) => Promise<O> }
    = this.serviceRegistry.get(service)

    const fn = camelCase(req.fn)
    if (!(fn in svc)) {
      throw new Error(`Bento: service name ${service} doesn't include a ${fn} handler.`)
    }

    const newCtx: BentoCtx<C> = {
      ...ctx,
      bento: this
    }

    return svc[fn](newCtx, input)
  }
}

export { IBentoTransport,
  IBentoSerializer,
  BentoRequestData,
  BentoResponseData,
  BufferWithCtx
}
