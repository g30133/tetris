import * as React from 'react';

import * as C from './constants'
import './Board.css';

export type CellType = '.' | 'c' | 'y' | 'p' | 'g' | 'r' | 'b' | 'o'


interface BoardProps {
    board: CellType[]
}

class Board extends React.Component<BoardProps> {
  public render() {
    const board = []
    for(let i = 0; i < C.NUM_ROWS*C.NUM_COLS; i++) {
        let className = 'cell'
        switch(this.props.board[i]) {
            case '.':
            className += ' empty'
            break
            case 'c':
            className += ' c'
            break
            case 'y':
            className += ' y'
            break
            case 'p':
            className += ' p'
            break
            case 'g':
            className += ' g'
            break
            case 'r':
            className += ' r'
            break
            case 'b':
            className += ' b'
            break
            case 'o':
            className += ' o'
            break
            default:
        }
        board.push(<div key={i} className={className}/>)
    }
    return (
     <div className='board'>{board}</div>
    )
  }
}
export default Board