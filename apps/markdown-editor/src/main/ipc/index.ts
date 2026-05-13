import { registerFileIPC } from './files';
import { registerWindowIPC } from './window';
import { registerAppIPC } from './app';

export function registerAllIPC(): void {
  registerFileIPC();
  registerWindowIPC();
  registerAppIPC();
}
