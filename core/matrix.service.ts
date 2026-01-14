import { Matrix, MatrixColumn, MatrixRow, createMatrix, upsertRow, freezeMatrix } from "./matrix.engine";

export function create(owner: string, name: string, columns: MatrixColumn[]): Matrix {
  return createMatrix(owner, name, columns);
}

export function putRow(m: Matrix, row: MatrixRow): Matrix {
  return upsertRow(m, row);
}

export function freeze(m: Matrix): Matrix {
  return freezeMatrix(m);
}
