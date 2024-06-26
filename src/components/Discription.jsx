import React from 'react';
import './styles/Description.css';

const Description = ({ data }) => {
  // console.log("description:",data[0]);
  if (typeof data === 'string') {
    data = { text: data };
  } else if (Array.isArray(data) && typeof data[0] === 'string') {
    data = { text: data[0] };
  }

  const text = data?.text || '';

  // Regex to split data into paragraphs and numbered points
  const parts = text.split(/(\d+\.\s)/).filter(part => part.trim() !== '');
  
  // Extract the introductory paragraph and points
  const introParagraph = parts[0];
  const points = [];
  for (let i = 1;i < parts.length; i += 2) {
    points.push(parts[i] + parts[i + 1]);
  }

  return (
    <div className="info-container">
      <h2 className="info-title">Product Information</h2>
      {introParagraph && <p className="info-paragraph">{introParagraph}</p>}
      <ul className="info-list">
        {points && points.map((point, index) => (
          <li key={index} className="info-point">{point.trim()}</li>
        ))}
      </ul>
      <p className="info-paragraph">
        For more detailed information, please refer to the product label or contact the manufacturer directly.
      </p>
    </div>
  );
};

export default Description;
