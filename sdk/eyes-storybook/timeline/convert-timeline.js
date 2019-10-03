'use strict';

window.convertTimeline = function convertTimeline(logStr) {
  const {lines} = window.convertLog(logStr);

  const reGettingData = /\(\):.+getting data from story (.+)/;
  const reStart = /running story (.+)$/;
  const reEnd = /finished story (.+) in .+$/;
  const reRenderId = /render request complete for (.+). test=(.+) stepCount/;
  const reScreenshotAvailable = /screenshot available for (.+) at /;
  const reCheckWindow = /running wrapper.checkWindow for test (.+) stepCount/;
  const reTimestamp = /\[\+(\d+)s\]/;
  const timing = {};
  const storiesByRenderId = {};

  lines.forEach(line => {
    const matchTime = line.match(reTimestamp);
    if (matchTime) {
      const ts = matchTime[1];
      const matchStart = line.match(reStart);
      const matchEnd = line.match(reEnd);
      const matchGettingData = line.match(reGettingData);
      const matchRenderId = line.match(reRenderId);
      const matchScreenshotAvailable = line.match(reScreenshotAvailable);
      const matchCheckWindow = line.match(reCheckWindow);

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
      } else if (matchRenderId) {
        const storyName = matchRenderId[2];
        const renderId = matchRenderId[1];
        const story = timing[storyName];
        storiesByRenderId[renderId] = story;
        story.renderId = renderId;
      } else if (matchScreenshotAvailable) {
        const renderId = matchScreenshotAvailable[1];
        const story = storiesByRenderId[renderId];
        story.screenshotAvailable = ts;
      } else if (matchCheckWindow) {
        const storyName = matchCheckWindow[1];
        timing[storyName].checkWindowStart = ts;
      }
    } else {
      // console.log('no timestamp found for line', line)
    }
  });

  return {timing, lines};
};
