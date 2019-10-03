'use strict';

window.convertTimeline = function convertTimeline(logStr) {
  const {lines} = window.convertLog(logStr);

  const reGettingData = /\(\):.+getting data from story (.+)/;
  const reStart = /running story (.+)$/;
  const reEnd = /finished story (.+) in .+$/;
  const reTimestamp = /\[\+(\d+)s\]/;
  const timing = {};

  lines.forEach(line => {
    const matchTime = line.match(reTimestamp);
    if (matchTime) {
      const ts = matchTime[1];
      const matchStart = line.match(reStart);
      const matchEnd = line.match(reEnd);
      const matchGettingData = line.match(reGettingData);

      if (matchStart) {
        const storyName = matchStart[1];
        if (!timing[storyName]) console.log('@@', storyName);
        timing[storyName].start = ts;
      } else if (matchEnd) {
        const storyName = matchEnd[1];
        timing[storyName].end = ts;
      } else if (matchGettingData) {
        const storyName = matchGettingData[1];
        timing[storyName] = {gettingData: ts};
      }
    } else {
      // console.log('no timestamp found for line', line)
    }
  });

  return {timing, lines};
};
