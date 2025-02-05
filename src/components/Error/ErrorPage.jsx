import React from 'react';
import './ErrorPage.css'
import Typewriter from 'react-ts-typewriter';

const ErrorPage = () => {
  return (
    <div className='errorContainer'>
      <div className='errorCard'>
        <h1 className='errorTitle'>Oops! <Typewriter text='Something went wrong.'/></h1>
        <p className='errorMessages'>We couldn't find the page you're looking for. Please try again later or go back to the homepage.</p>
        <a href="/" className='goHomeBtn'>Go to Homepage</a>
      </div>
    </div>
  );
};

export default ErrorPage;
