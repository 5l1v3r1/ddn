import depd from 'depd'
import assetTypes from './asset-types'
import runtimeState from './runtime-states'
// import address from './address';
import amount from './amount'
import LimitCache from './limit-cache'
import system from './system'
import bignum from './bignumber'
import routesMap from './routes-map'

const deprecated = depd('@ddn')

export default {
  LimitCache,

  assetTypes,
  runtimeState,
  amount,
  system,
  bignum,
  routesMap,
  deprecated
}
