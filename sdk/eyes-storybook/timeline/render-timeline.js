/* global timeline */
'use strict';

const PIXEL_PER_SECOND = 10;
const SECONDS_PER_NOTCH = 5;
const VERTICAL_SPACE_BETWEEN_STORIES = 1;
const STORY_HEIGHT = 1;

window.renderTimeline = function renderTimeline(data) {
  const maxTime = Object.values(data).reduce(
    (acc, {end}) => (acc > Number(end) ? acc : Number(end)),
    0,
  );
  const rendered = [];
  let maxIntersections = 0;
  timeline.style.width = maxTime * PIXEL_PER_SECOND + 'px';

  for (let i = 0; i < maxTime; i += SECONDS_PER_NOTCH) {
    timeline.appendChild(createNotch(i));
  }

  for (const name in data) {
    const {start, end, gettingData, screenshotAvailable, checkWindowStart} = data[name];
    const gettingData0 = gettingData === start ? start - 0.5 : gettingData;

    const gettingDataDiv = document.createElement('div');
    gettingDataDiv.classList = 'getting-data';
    gettingDataDiv.style.left = PIXEL_PER_SECOND * gettingData0 + 'px';
    gettingDataDiv.style.width = PIXEL_PER_SECOND * (start - gettingData0) + 'px';
    gettingDataDiv.style.height = STORY_HEIGHT + 'px';

    const vgDiv = document.createElement('div');
    vgDiv.classList = 'vg';
    vgDiv.style.left = PIXEL_PER_SECOND * start + 'px';
    vgDiv.style.width = PIXEL_PER_SECOND * (screenshotAvailable - start) + 'px';
    vgDiv.style.height = STORY_HEIGHT + 'px';

    const eyesDiv = document.createElement('div');
    eyesDiv.classList.add('eyes');
    eyesDiv.style.left = PIXEL_PER_SECOND * checkWindowStart + 'px';
    eyesDiv.style.width = PIXEL_PER_SECOND * (end - checkWindowStart) + 'px';
    eyesDiv.style.height = STORY_HEIGHT + 'px';

    const gapDiv = document.createElement('div');
    gapDiv.classList.add('gap');
    gapDiv.style.left = PIXEL_PER_SECOND * screenshotAvailable + 'px';
    gapDiv.style.width = PIXEL_PER_SECOND * (checkWindowStart - screenshotAvailable) + 'px';
    gapDiv.style.height = STORY_HEIGHT + 'px';

    const interesctions = calcExistingIntersectingStories({start, end});
    maxIntersections = Math.max(maxIntersections, interesctions);
    const top =
      VERTICAL_SPACE_BETWEEN_STORIES +
      STORY_HEIGHT * interesctions +
      VERTICAL_SPACE_BETWEEN_STORIES * interesctions +
      'px';
    vgDiv.style.top = top;
    eyesDiv.style.top = top;
    gettingDataDiv.style.top = top;
    gapDiv.style.top = top;

    const span = document.createElement('span');
    span.classList.add('story-name');
    span.textContent = `${name} [${start}s - ${end}s] [${end - start}s]`;
    vgDiv.appendChild(span);

    timeline.appendChild(eyesDiv);
    timeline.appendChild(vgDiv);
    timeline.appendChild(gettingDataDiv);
    timeline.appendChild(gapDiv);
    rendered.push({start, end});
  }

  timeline.style.height =
    2 * VERTICAL_SPACE_BETWEEN_STORIES +
    (maxIntersections + 1) * STORY_HEIGHT +
    maxIntersections * VERTICAL_SPACE_BETWEEN_STORIES +
    'px';

  function calcExistingIntersectingStories(_storyTime) {
    // for (let i=0; i < rendered.length; i++) {
    //   if (!isIntersecting(rendered[i], storyTime)) return i;
    // }
    return rendered.length;
  }

  function _isIntersecting(t1, t2) {
    return (
      (t1.start <= t2.start && t1.end >= t2.start) || (t2.start <= t1.start && t2.end >= t1.start)
    );
  }

  function createNotch(time) {
    const div = document.createElement('div');
    div.classList.add('notch');
    div.style.left = time * PIXEL_PER_SECOND + 'px';
    div.style.width = SECONDS_PER_NOTCH * PIXEL_PER_SECOND + 'px';

    if (!(time % 10)) {
      const span = document.createElement('span');
      span.textContent = time;
      div.appendChild(span);
    }
    return div;
  }
};
