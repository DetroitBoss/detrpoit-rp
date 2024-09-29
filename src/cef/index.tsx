import * as React from 'react'
import {render} from 'react-dom'

import 'regenerator-runtime/runtime'
import './modules/dev.mode'
import './modules/custom.event'
import './modules/socket.io'
import {App} from './App'
import './sound'

import './style.sass'

render(<App/>, document.getElementById('root'))
