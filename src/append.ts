import {
  TextDocument,
  window,
  TextEdit,
  TextEditorEdit,
  Range,
  Position,
} from 'vscode'
import * as DiffMatchPatch from 'diff-match-patch'
import { CustemTextEdit, CustomEditType, IPreprocessorOption } from './types'
import * as PugProcess from 'webpack-preprocessor-pug-tsx'
import { getConfiguration } from './utils'

export function appendCurrentDocument() {
  const {
    activeTextEditor: editor,
    activeTextEditor: { document },
  } = window

  const appendedText = calculateTargetTextForPug(document)
  if (!appendedText || appendedText === document.getText()) {
    return
  }

  // 원본과 수정본 차이를 document에 반영.
  editor.edit((edit) => {
    const edits = getCustomEdits(document.getText(), appendedText)
    edits.forEach((e) => {
      switch (e.action) {
        case CustomEditType.replace:
          edit.replace(e.range, e.value)
          break
        case CustomEditType.insert:
          edit.insert(e.position, e.value)
          break
        case CustomEditType.delete:
          edit.delete(e.range)
          break
      }
    })
    return edit
  })
}

export function remove() {}

/**
 * calculate target text by applying webpack-preprocessor-pug-tsx
 *
 * @param document document to work on
 */
export function calculateTargetTextForPug(document: TextDocument): string {
  const options = getConfiguration<IPreprocessorOption>('options') || {}
  const currentText = document
    .getText()
    .replace(/(\n\n\/\/appended from pug-tsx[\w\r\n; ]*)/gm, '')
  let resultText = ''

  resultText = PugProcess.call({ query: options }, currentText)

  return resultText
}

/**
 * calculate array of custom text edits
 *
 * @param source text for edits
 * @param target
 */
export function getCustomEdits(source, target): CustemTextEdit[] {
  var diff = getDiff(source, target)

  var edits = []
  var currentIndex = 0

  // for each diff in our
  diff.forEach(([action, value], idx) => {
    switch (action) {
      case 0:
        // keep action
        // increase pointer with length
        currentIndex += value.length
        break
      case -1:
        // delete action
        let fromIdx = currentIndex
        let toIdx = currentIndex + value.length
        let sourceRange = new Range(
          getPositionFromIndex(source, fromIdx),
          getPositionFromIndex(source, toIdx),
        )

        // if next action is insert we do replace instead
        if (idx < diff.length - 1 && diff[idx + 1][0] === 1) {
          edits.push({
            action: CustomEditType.replace,
            range: sourceRange,
            position: null,
            value: diff[idx + 1][1],
          })
          currentIndex += value.length
        } else {
          edits.push({
            action: CustomEditType.delete,
            range: sourceRange,
            position: null,
            value: '',
          })
          currentIndex += value.length
        }
        break
      case 1:
        // insert action
        if (idx === 0 || diff[idx - 1][0] !== -1) {
          const p = getPositionFromIndex(source, currentIndex)
          edits.push({
            action: CustomEditType.insert,
            range: new Range(p, p),
            position: p,
            value: value,
          })
        }
        // last action was delete, we skip
        break
    }
  })
  return edits
}

/**
 * calculate an array of diffs
 *
 * @param source text for diff
 * @param target text for diff
 */
export function getDiff(source, target) {
  var dmp = new DiffMatchPatch()
  return dmp.diff_main(source, target)
}

/**
 * we can calculate position from index
 *
 * @param text as string
 * @param idx as number
 */
export function getPositionFromIndex(text: string, idx: number) {
  var front = text.substring(0, idx)
  var lineEndings = front.match(/\n/g)
  var lineNum = 0
  if (lineEndings !== null) {
    lineNum = lineEndings.length
  }
  var lastLine = front.lastIndexOf('\n')
  var charPos = lastLine !== -1 ? idx - lastLine - 1 : idx
  return new Position(lineNum, charPos)
}

function applyEditsForNewText(regreplacedText) {
  const {
    activeTextEditor: editor,
    activeTextEditor: { document },
  } = window

  return editor.edit((edit) => {
    // v1 use diff edits
    const edits = getCustomEdits(document.getText(), regreplacedText)
    edits.forEach((e) => {
      switch (e.action) {
        case CustomEditType.replace:
          edit.replace(e.range, e.value)
          break
        case 1:
          edit.insert(e.position, e.value)
          break
        case -1:
          edit.delete(e.range)
          break
      }
    })
    return edit

    // v0 use replace all
    // return edit.replace(getMaxRange(), regreplacedText)
  })
}
