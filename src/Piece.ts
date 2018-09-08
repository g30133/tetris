import * as C from './constants'
import { CellType } from './Board';

type PieceColor = 'r' | 'g' | 'b' | 'y'
export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
export type DirectionType = 's' |'e' | 'w'
export type rotateType = '0deg' | '90deg' | '180deg' | '270deg'

interface unitDelta {
    dr:number
    dc:number
}

class Piece {
    type:PieceType
    color:PieceColor
    unitIxs:number[] = []
    unitDeltas:unitDelta[] = []
    width:number
    height:number
    startRow:number
    startCol:number

    constructor(type:PieceType, color:PieceColor) {
        this.type = type
        this.color = color

        this.init()
    }

    private init() {
        switch(this.type) {
            case 'O':
                this.width = 2
                this.height = 2
                this.unitDeltas.push({ dr:0, dc:0 })
                this.unitDeltas.push({ dr:0, dc:1 })
                this.unitDeltas.push({ dr:1, dc:0 })
                this.unitDeltas.push({ dr:1, dc:1 })
            break
            case 'I':
                this.width = 1
                this.height = 4
                this.unitDeltas.push({ dr:0, dc:0 })
                this.unitDeltas.push({ dr:1, dc:0 })
                this.unitDeltas.push({ dr:2, dc:0 })
                this.unitDeltas.push({ dr:3, dc:0 })
            break
            case 'T':
                this.width = 3
                this.height = 2
                this.unitDeltas.push({ dr:0, dc:0 })
                this.unitDeltas.push({ dr:0, dc:1 })
                this.unitDeltas.push({ dr:0, dc:2 })
                this.unitDeltas.push({ dr:1, dc:1 })
            break
            case 'S':
                this.width = 3
                this.height = 2
                this.unitDeltas.push({ dr:0, dc:2 })
                this.unitDeltas.push({ dr:0, dc:1 })
                this.unitDeltas.push({ dr:1, dc:1 })
                this.unitDeltas.push({ dr:1, dc:0 })
            break
            case 'Z':
                this.width = 3
                this.height = 2
                this.unitDeltas.push({ dr:0, dc:0 })
                this.unitDeltas.push({ dr:0, dc:1 })
                this.unitDeltas.push({ dr:1, dc:1 })
                this.unitDeltas.push({ dr:1, dc:2 })
            break
            case 'J':
                this.width = 3
                this.height = 2
                this.unitDeltas.push({ dr:0, dc:0 })
                this.unitDeltas.push({ dr:1, dc:0 })
                this.unitDeltas.push({ dr:1, dc:1 })
                this.unitDeltas.push({ dr:1, dc:2 })
            break
            case 'L':
                this.width = 3
                this.height = 2
                this.unitDeltas.push({ dr:1, dc:0 })
                this.unitDeltas.push({ dr:1, dc:1 })
                this.unitDeltas.push({ dr:1, dc:2 })
                this.unitDeltas.push({ dr:0, dc:2 })
                break
            default:
        }
    }

    // move one cell to the direction
    public move(direction:DirectionType) {
        switch (direction) {
            case 's':
                this.startRow++
            break;
            case 'e':
                this.startCol++
            break;
            case 'w':
                this.startCol--
            break;
            default:
                console.log('UNEXPECTED DIRECTION:' + direction)
            break
        }
        this.setupPosition(this.startRow, this.startCol, '0deg')
    }

    public setupPosition(startRow:number, startCol:number, rotateAngle:rotateType) {
        this.startRow = startRow
        this.startCol = startCol

        this.unitIxs = []
        for(let i = 0; i < this.unitDeltas.length; i++) {
            const delta = this.unitDeltas[i]
            switch(rotateAngle) {
                case '0deg' : {
                    const r = startRow + delta.dr
                    const c = startCol + delta.dc
//                    console.log('r:' + r + '    c:' + c)
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                }
                break
                case '90deg' : {
                    const r = startRow + delta.dc
                    const c = startCol - delta.dr + (this.height - 1)
//                    console.log('r:' + r + '    c:' + c)
                    
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                }
                break
                case '180deg' : {
                    const r = startRow - delta.dr + (this.height - 1)
                    const c = startCol - delta.dc + (this.width - 1)
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                }
                break
                case '270deg' : {
                    const r = startRow - delta.dc + (this.width - 1)
                    const c = startCol + delta.dr
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                }
                break
                default: {
                    console.log('unexpected rotateAngle:' + rotateAngle)
                }
            }
        }
    }


    public isContactingFloor() {
        // checking against floor
        for(const unitIx of this.unitIxs) {
            if(unitIx + C.NUM_COLS >= C.NUM_COLS * C.NUM_ROWS) {
                return true
            }
        }
        return false
    }

    public isContactingFixed(fixed:CellType[], direction:DirectionType) {
        console.log('direction:' + direction)
        for(let i = 0; i < fixed.length; i++) {
            if(fixed[i] !== '.') {
              for(const pieceIx of this.unitIxs) {
                //TODO check if piece index is one row above a fixed index
                //console.log('rowIx of piece:' + pieceIx)
                console.log('pieceIx: ' + pieceIx + ' i-1:' + (i-1) + ': ' + (pieceIx === i - 1))
                if(pieceIx === i - C.NUM_COLS || (direction === 'w' && pieceIx === i + 1) || (direction === 'e' && pieceIx === i - 1)) {
                    console.log('return true')
                    return true
                }
              }
            }
          }
        console.log('return false')
        return false
    }

    public emit(board:CellType[]) {
        for(let index = 0; index < this.unitIxs.length; index++) {
            board[this.unitIxs[index]] = this.color
        }
    }
}
export default Piece