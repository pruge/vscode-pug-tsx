/**
 * Utils
 *
 * @author prugehada
 * @version 0.0.1
 */
import { commands, ExtensionContext, workspace } from 'vscode'
import { EXTENSION_NAME } from './utils'
import onSave from './onSave'
import { appendCurrentDocument, remove } from './append'

export function activate({ subscriptions }: ExtensionContext) {
  subscriptions.push(
    commands.registerCommand(
      EXTENSION_NAME + '.append-pug-variable',
      appendCurrentDocument,
    ),
  )

  onSave.update()
  workspace.onDidChangeConfiguration(() => onSave.update())
}

// this method is called when your extension is deactivated
export function deactivate() {}
