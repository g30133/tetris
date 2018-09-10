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
    rotateAngle:number

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
        console.log('this.rotateAngle:' + this.rotateAngle)
        this.setupPosition(this.startRow, this.startCol, this.rotateAngle)
    }

    public rotate(rotateAngle:number) {
        switch(rotateAngle) {
            case 0:
                this.rotateAngle = 0
            break
            case 90:
                this.rotateAngle = 90
            break
            case 180:
                this.rotateAngle = 180
            break
            case 270:
                this.rotateAngle = 270
            break
            default:
        }
    }

    public setupPosition(startRow:number, startCol:number, rotateAngle:number) {
        this.startRow = startRow
        this.startCol = startCol

        this.unitIxs = []
        for(let i = 0; i < this.unitDeltas.length; i++) {
            const delta = this.unitDeltas[i]
            console.log('rotateAngle is :' + rotateAngle)
            switch(rotateAngle) {
                case 0 : {
                    const r = startRow + delta.dr
                    const c = startCol + delta.dc
//                    console.log('r:' + r + '    c:' + c)
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                    this.rotateAngle = 0
                }
                break
                case 90 : {
                    const r = startRow + delta.dc
                    const c = startCol - delta.dr + (this.height - 1)
//                    console.log('r:' + r + '    c:' + c)
                    
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                    this.rotateAngle = 90
                }
                break
                case 180 : {
                    const r = startRow - delta.dr + (this.height - 1)
                    const c = startCol - delta.dc + (this.width - 1)
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                    this.rotateAngle = 180
                }
                break
                case 270 : {
                    const r = startRow - delta.dc + (this.width - 1)
                    const c = startCol + delta.dr
                    if(r >= 0 && r < C.NUM_ROWS && c >= 0 && c < C.NUM_COLS) {
                        this.unitIxs.push(C.NUM_COLS * r + c)
                    }
                    this.rotateAngle = 270
                }
                break
                default: {
                    console.log('unexpected rotateAngle:' + rotateAngle)
                }
            }
        }
        console.log('this.rotateAngle:' + this.rotateAngle)

    }


/*    public isContactingWall() {
        //right wall
        if((unitIx % C.NUM_COLS) >= C.NUM_COLS-1  && direction === 'e') {
            console.log('HIT RIGHT WALL')
            return true
        }

        //left wall
        if((unitIx % C.NUM_COLS) <= 0 && direction === 'w') {
            console.log('HIT LEFT WALL')
            return true
        }
    }
*/
    public isContactingFloor() {
        // checking against floor
        console.log('isContactingFloor')
        for(const unitIx of this.unitIxs) {
            console.log('unitIx:' + unitIx)
            //floor
            if(unitIx + C.NUM_COLS >= C.NUM_COLS * C.NUM_ROWS) {
                console.log('HIT FLOOR')
                return true
            }
        }
        return false
    }

    public isContactingFixed(fixed:CellType[]) {
        for(let i = 0; i < fixed.length; i++) {
            if(fixed[i] !== '.') {
              for(const pieceIx of this.unitIxs) {
                if(pieceIx === i - C.NUM_COLS) {
                    console.log('return true')
                    return true
                }
              }
            }
          }
        console.log('return false')
        return false
    }

    public isMovableTo(fixed:CellType[], direction:DirectionType) {
        for(let i = 0; i < this.unitIxs.length; i++) {
            if(direction === 'w') {
                if((this.unitIxs[i] % C.NUM_COLS) <= 0 && direction === 'w') return false
                if(fixed[this.unitIxs[i] - 1] !== '.') return false
            } else if(direction === 'e') {
                if((this.unitIxs[i] % C.NUM_COLS) >= C.NUM_COLS-1  && direction === 'e') return false
                if(fixed[this.unitIxs[i] + 1] !== '.') return false
            }
        }
        return true
    }

    public emit(board:CellType[]) {
        for(let index = 0; index < this.unitIxs.length; index++) {
            board[this.unitIxs[index]] = this.color
        }
    }
}
export default Piece