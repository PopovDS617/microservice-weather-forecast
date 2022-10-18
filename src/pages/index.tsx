import React, { useState } from 'react';
import CurrentWeather from '../components/current-weather/CurrentWeather';
import Forecast from '../components/forecast/Forecast';
import Search from '../components/search/Search';
import Spinner from '../components/ui/Spinner';
import { WEATHER_API_URL } from '../utils/weather-fetch-helpers';
import { motion } from 'framer-motion';

const Home = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSearchChange = (searchData) => {
    setIsLoading(true);
    const [lat, lon] = searchData.value.split(' ');
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    const forecastWeatherFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    Promise.all([currentWeatherFetch, forecastWeatherFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();
        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecastWeather({ city: searchData.label, ...forecastResponse });
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="h-full flex flex-col justify-between align-middle">
      <motion.div
        className="lg:w-5/12 sm:w-8/12 mx-auto mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Search onSearchChange={handleOnSearchChange} />
      </motion.div>

      {isLoading && <Spinner />}
      {!isLoading && (
        <motion.div
          className="flex  flex-col    lg:flex-row justify-evenly items-start w-full mx-auto my-12  "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="w-6/12 flex justify-end items-start ">
            {currentWeather && <CurrentWeather data={currentWeather} />}
          </div>
          <div className="w-6/12 flex justify-start items-start">
            {forecastWeather && <Forecast data={forecastWeather} />}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
