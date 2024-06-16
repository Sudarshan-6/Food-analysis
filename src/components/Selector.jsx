import React, { useContext } from 'react';
import './styles/Selector.css';
import Context from './Context';

const Selector = ({ options }) => {
    const { selectedOption, setSelectedOption } = useContext(Context);

    const handleOptionClick = (option) => {
        setSelectedOption(oldoption => option);
    };

    return (
        <div className="selector">
            {options.map((option) => (
                <button
                    key={option}
                    className={`selector-option ${selectedOption === option ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default Selector;
