import PayBlockStore from './index'

export default {
    'server:payment:data': (store: PayBlockStore, name: string, sum: number, id: number) => store.setState({name, sum, id})
}