import { run } from '@ember/runloop';

export default function getDebugInfoAvailable() {
  return typeof run.backburner.getDebugInfo === 'function';
}
