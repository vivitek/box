
/**
 * @param {any} data 
 * @param {any} MsgMgr
 * @param {any} logger 
 * @param {Array<string>} bindedAddr 
 */
function onBound(data, msgMgr, logger, bindedAddr) {
  if (!bindedAddr.includes(data.chaddr)) {
    bindedAddr.push(data.chaddr)
    logger.info('Bounded', addr, '. Notifying server')
    msgMgr.sendMsg({})
  } else {
    logger.info('Addr already binded')
  }
}

/**
 * @param {any} socket
 * @param {any} logger
 * @param {Array<string>} bindedAddr
 */