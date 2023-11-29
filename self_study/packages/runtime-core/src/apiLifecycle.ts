import { currentInstance, setCurrentInstance } from "./component"

const enum lifeCycle {
  BEFOREMOUNT='bm',
  MOUNTED='m',
  BEFOREUPDATE='bu',
  UPDATE='u'
}

export const onBeforeMount = createHook(lifeCycle.BEFOREMOUNT)
export const onMount = createHook(lifeCycle.MOUNTED)
export const onBeforeUpdate = createHook(lifeCycle.BEFOREUPDATE)
export const onUpdate = createHook(lifeCycle.UPDATE)

function createHook(lifeCycle) {
  return function(hook, target=currentInstance) {
    injectHook(lifeCycle, hook, target)
  }
}

function injectHook(lifeCycle, hook, target) {
  if (!target) return
  const hooks = target[lifeCycle] || (target[lifeCycle]=[])
  const rap = () => {
    setCurrentInstance(target)
    hook()
    setCurrentInstance(null)
  }
  hooks.push(hook)
}

export function invokeArrayFns(FnArr) {
  FnArr.array.forEach(fn => fn());
}
