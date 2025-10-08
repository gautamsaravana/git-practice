import React from 'react';
import './MoviesList.css';

const moviesData = [
  {
    id: 1,
    screen: 'Crown 01',
    startDate: '24-05-2025',
    endDate: 'Running',
    name: 'Pushpa 2',
    lang: 'Telugu',
    duration: '2:48 min',
    genre: 'Action',
    description:
      'The Rule is a Telugu action film directed by Sukumar and starring Allu Arjun. It was released on December 5, 2024, in multiple languages. The film follows Pushpa Raj, who is now a red sandalwood smuggler, as he faces new challenges and threats.',
    image: 'pushpa2.jpg', // image path in your public folder
    timings: ['11.30 Pm', '03.30 Pm', '06.30 Pm', '10.30 Pm'],
  },
  // You can add more movie objects here
];

const MoviesList = () => {
  return (
    <div className="movies-container">
      <button className="add-movie-btn">Add Movie</button>
      {moviesData.map((movie) => (
        <div className="movie-card" key={movie.id}>
          <img src={movie.image} alt={movie.name} className="movie-image" />
          <div className="movie-details">
            <p><strong>Screen:</strong> {movie.screen}</p>
            <div className="timings">
              {movie.timings.map((time, index) => (
                <button className="time-btn" key={index}>{time}</button>
              ))}
            </div>
            <p><strong>startDate:</strong> {movie.startDate} &nbsp;&nbsp;
              <strong>End Date:</strong> {movie.endDate}
            </p>
            <p><strong>Name:</strong> {movie.name} &nbsp;
              <strong>Lang:</strong> {movie.lang} &nbsp;
              <strong>duration:</strong> {movie.duration}
            </p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p>{movie.description}</p>
            <div className="btn-group">
              <button className="crew-btn">Add Crew And Cast</button>
              <button className="update-btn">Update</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviesList;
