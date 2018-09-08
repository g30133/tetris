import * as React from 'react';
import './App.css';

import * as C from './constants'
import Board, { CellType } from './Board'
import Piece, { PieceType, DirectionType } from './Piece';
import Util from './Util'

interface AppState {
  board: CellType[]
}

class App extends React.Component<any, AppState> {
  currentPiece: Piece
  fixed: CellType[]
  pieceTypes: PieceType[]
  direction:DirectionType

  constructor(props:any) {
    super(props)

    this.gameLoop = this.gameLoop.bind(this)

    this.state = {
      board: [],
    }

    this.init()

  }

  private init() {
    for (let i = 0; i < C.NUM_ROWS * C.NUM_COLS; i++) {
      this.state.board.push('.')
    }

    console.log('pieceType:' + this.pieceTypes)

    this.direction = 's'

    this.pieceTypes = []

    this.pieceTypes.push('I')
    this.pieceTypes.push('J')
    this.pieceTypes.push('L')
    this.pieceTypes.push('O')
    this.pieceTypes.push('S')
    this.pieceTypes.push('T')
    this.pieceTypes.push('Z')

    const index = Math.floor(Math.random() * this.pieceTypes.length)
    this.currentPiece = new Piece(this.pieceTypes[index], 'r')
    this.currentPiece.setupPosition(-3, Math.floor(Math.random() * C.NUM_COLS), '0deg')

    this.fixed = Array.from(this.state.board)

    document.addEventListener('keydown', (event) => {
      if(event.key === 'ArrowLeft') {
        this.onKeyDown('w')
      } else if(event.key === 'ArrowRight') {
        this.onKeyDown('e')
      } else if(event.key === 'ArrowDown') {
        //TODO MAKE PIECE MOVE ALL THE WAY DOWN
      } else if(event.key === 'ArrowUp') {
        //TODO MAKE PIECE ROTATE
      }
    })
  }

  componentDidMount() {
    this.gameLoop()
  }

  private onKeyDown(direction:DirectionType) {
/*    if(direction === 'left') {
      console.log('left clicked')
      this.currentPiece.move('w')
    } else if(direction === 'right') {
      console.log('right clicked')
      this.currentPiece.move('e')
    }
*/
    this.direction = direction
  }

  private isContacting():boolean {
    // TODO
    // 1. current piece against floor
    if(this.currentPiece.isContactingFloor()) return true
    if(this.currentPiece.isContactingFixed(this.fixed, this.direction)) {
      console.log('THAT MOVE CAUSES CONTACT WITH FIXED')
      return true
    }


    // TODO
    // check contacting with other pieces
    // 2. current piece against fixed
/*    for(let i = 0; i < this.fixed.length; i++) {
      if(this.fixed[i] !== '.') {
        console.log('fixed Index:' + i)
        for(const pieceIx of this.currentPiece.unitIxs) {
          console.log('pieceIx:' + pieceIx)
          //TODO check if piece index is one row above a fixed index
          if(pieceIx === i - C.NUM_COLS) {
            console.log('LOOKS LIKE YOU CRASH TO ANOTHER PIECE!')
            return true
          }
        }
      }
    }
    */
//    for(const fixedPiece of this.fixed) {
//      console.log('fixed Piece:' + fixedPiece)
//    }

    return false
  }

  private gameLoop() {
    console.log('gameLoop() board:')
    Util.dumpBoard(this.state.board)
    setTimeout(this.gameLoop, C.ANIMATION_DELAY)

    const newBoard = Array.from(this.fixed)
    
    if (this.isContacting()) {
      console.log('yes contacting')
      // 1. move currentPiece into fixed
      if(this.direction === 's') {
        this.currentPiece.emit(this.fixed)
        this.setState({
          board: this.fixed
        }, () => {
          // 2. assign currentPiece a new Piece
          const index = Math.floor(Math.random() * this.pieceTypes.length)
          this.currentPiece = new Piece(this.pieceTypes[index], 'r')
          this.currentPiece.setupPosition(-3, Math.floor(Math.random() * (C.NUM_COLS-1)), '0deg')
        })
      }
    }
    else {
      if(this.currentPiece.isContactingFixed(this.fixed, this.direction) === false) { 
        console.log('moving piece not contacting direction:' + this.direction)
        this.currentPiece.move(this.direction)
      }

      if(this.direction !== 's' && this.currentPiece.isContactingFixed(this.fixed, 's') === false) {
        this.currentPiece.move('s')
      }
      this.currentPiece.emit(newBoard)
      console.log('currentPiece:' + JSON.stringify(this.currentPiece))
      this.setState({
        board: newBoard
      })
    }
    this.direction = 's'
    console.log('this.currentPiece:' + JSON.stringify(this.currentPiece))

  }

  public render() {
    return (
      <div className="app">
        <Board
          board={this.state.board}
        />

      </div>
    );
  }
}

export default App;