import * as React from 'react';
import './App.css';

import * as C from './constants'
import Board, { CellType } from './Board'
import Piece from './Piece';
import Util from './Util'

interface AppState {
  board: CellType[]
}

class App extends React.Component<any, AppState> {
  currentPiece: Piece
  fixed: CellType[]

  constructor(props:any) {
    super(props)

    this.gameLoop = this.gameLoop.bind(this)

    this.state = {
      board: []
    }

    this.init()

  }

  private init() {
    for (let i = 0; i < C.NUM_ROWS * C.NUM_COLS; i++) {
      this.state.board.push('.')
    }

    this.currentPiece = new Piece('O', 'r')
    this.currentPiece.setupPosition(-3, Math.floor(Math.random() * C.NUM_COLS), '0deg')

    this.fixed = Array.from(this.state.board)

    document.addEventListener('keydown', (event) => {
      if(event.key === 'ArrowLeft') {
        this.onKeyDown('left')
      } else if(event.key === 'ArrowRight') {
        this.onKeyDown('right')
      } else if(event.key === 'ArrowDown') {
        //TODO MAKE PIECE MOVE ALL THE WAY DOWN
      }
    })
  }

  componentDidMount() {
    this.gameLoop()
  }

  private onKeyDown(direction:string) {
    if(direction === 'left') {
      console.log('left clicked')
      this.currentPiece.move('w')
    } else if(direction === 'right') {
      console.log('right clicked')
      this.currentPiece.move('e')
    }
  }

  private isContacting():boolean {
    // TODO
    // 1. current piece against floor
    if(this.currentPiece.isContacting()) return true

    // 2. current piece against fixed

    return false
  }

  private gameLoop() {
    console.log('gameLoop() board:')
    Util.dumpBoard(this.state.board)
    setTimeout(this.gameLoop, C.ANIMATION_DELAY)

    const newBoard = Array.from(this.fixed)
    
    if (this.isContacting()) {
      console.log('inside isContacting')
      // TODO
      // 1. move currentPiece into fixed
      this.currentPiece.emit(this.fixed)
      this.setState({
        board: this.fixed
      }, () => {
        // 2. assign currentPiece a new Piece
        this.currentPiece = new Piece('O', 'r')
        this.currentPiece.setupPosition(-3, Math.floor(Math.random() * (C.NUM_COLS-1)), '0deg')
      })
    }
    else {
      this.currentPiece.move('s')
      this.currentPiece.emit(newBoard)
      console.log('currentPiece:' + JSON.stringify(this.currentPiece))
      this.setState({
        board: newBoard
      })  
    }
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