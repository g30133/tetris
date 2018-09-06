import * as React from 'react';

import * as C from './constants'
import './Board.css';

export type CellType = '.' | 'r' | 'g' | 'b' | 'y'


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
            case 'r':
            className += ' r'
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