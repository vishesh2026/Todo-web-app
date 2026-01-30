import React, { useContext } from 'react';
import BoardContext from '../../context/BoardContext';
import BoardItem from './BoardItem';

function BoardList({ onBoardSelect, selectedBoard }) {
    const { boards } = useContext(BoardContext);

    if (boards.length === 0) {
        return (
            <div className="empty-boards">
                <p>No boards yet. Create your first board to get started!</p>
            </div>
        );
    }

    return (
        <div className="board-list">
            {boards.map((board) => (
                <BoardItem
                    key={board._id}
                    board={board}
                    isSelected={selectedBoard === board._id}
                    onClick={() => onBoardSelect(board._id)}
                />
            ))}
        </div>
    );
}

export default BoardList;