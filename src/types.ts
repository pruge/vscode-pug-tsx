import { Range, Position } from 'vscode'

export enum CustomEditType {
  replace = 0,
  delete = -1,
  insert = 1,
}

export interface CustemTextEdit {
  action: CustomEditType
  range: Range
  position?: Position
  value: string
}

export interface IParamsMap {
  [key: string]: any
}

export interface IPattern {
  start: string
  end: string
}

export interface IPreprocessorOption {
  includes: string[]
  start: string[]
  end: string
  replace: IParamsMap
  pattern: IPattern
}
