import * as C from './constants'
import { CellType } from './Board';

type PieceColor = 'r' | 'g' | 'b' | 'y'
type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
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


    public isContacting() {
        for(const unitIx of this.unitIxs) {
            if(unitIx + C.NUM_COLS >= C.NUM_COLS * C.NUM_ROWS) {
                return true
            }
        }
        return false
    }

    public emit(board:CellType[]) {
        for(let index = 0; index < this.unitIxs.length; index++) {
            board[this.unitIxs[index]] = this.color
        }
    }
}
export default Piece