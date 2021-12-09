/**
 * Utils
 *
 * @author prugehada
 * @version 0.0.1
 */

import { Range, workspace } from 'vscode'
// import { parse } from 'hjson'
// const clearModule = require('clear-module')
// import { watchFile, readFileSync } from 'fs'
// import { IPreprocessorOption } from './types'

// const localPath = __dirname + '/settings.json'

// const loadOptions = () =>
//   parse(readFileSync(localPath).toString()).options || []

// let options = loadOptions()

export const EXTENSION_NAME = 'pug-tsx'

// watchFile(localPath, reloadSettings)

// export function reloadSettings() {
//   // clearModule(localPath)
//   options = loadOptions()
// }

export function getConfiguration<T>(key: string): T {
  return workspace.getConfiguration(EXTENSION_NAME).get<T>(key)
}

// export function getConfiguration(): Partial<IPreprocessorOption> {
//   return options
// }

export function getMaxRange(): Range {
  return new Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE)
}
