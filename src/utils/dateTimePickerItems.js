export const getTimes = () => {
  let times = [];

  /* eslint-disable */
  for (let time = 0; time < 24; time++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const hour = time < 10 ? `0${time}` : time;
      const minute = minutes < 10 ? `0${minutes}` : minutes;

      times.push(`${time}:${minute}`);
    }
  }
  /* eslint-enable */

  return times;
};
