/**
 * onSave
 *
 * @author prugehada
 * @version 0.0.1
 */
import {
  Disposable,
  TextDocumentWillSaveEvent,
  TextEdit,
  workspace,
  window,
  Position,
  Selection,
} from 'vscode'
import { getConfiguration, getMaxRange } from './utils'
import { CustomEditType } from './types'
import {
  getCustomEdits,
  calculateTargetTextForPug,
  appendCurrentDocument,
} from './append'

let subscription: Disposable
export default {
  get isEnabled() {
    return getConfiguration<boolean>('on-save')
  },

  register() {
    if (subscription) {
      return
    }

    subscription = workspace.onWillSaveTextDocument(listener)
  },

  unregister() {
    if (!subscription) {
      return
    }

    subscription.dispose()
    // subscription = null;
  },

  update() {
    if (this.isEnabled) {
      this.register()
    } else {
      this.unregister()
    }
  },

  bypass(action) {
    this.unregister()
    const result = action()
    return result.then(() => this.update())
  },
}

/**
 * callback listener, we apply small delta changes
 */
function listener({ document, waitUntil }: TextDocumentWillSaveEvent) {
  // // 수정본 가져오기.
  // const appendedText = calculateTargetTextForPug(document)
  // if (!appendedText || appendedText === document.getText()) {
  //   return
  // }

  // // 원본과 수정본 차이를 document에 반영.
  // const edits = getCustomEdits(document.getText(), appendedText)
  // const textEdits = edits.map((e) => {
  //   switch (e.action) {
  //     case CustomEditType.replace:
  //       return new TextEdit(e.range, e.value)
  //     case CustomEditType.insert:
  //       return new TextEdit(e.range, e.value)
  //     case CustomEditType.delete:
  //       return new TextEdit(e.range, '')
  //   }
  // })
  // waitUntil(Promise.all(textEdits))

  waitUntil(Promise.all([appendCurrentDocument()]))
}
