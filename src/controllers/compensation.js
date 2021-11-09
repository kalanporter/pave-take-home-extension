import fs from 'fs';
import path from 'path';
import csvparser from 'csv-parser';

const hookfishDataPromise = new Promise((resolve, reject) => {
  const results = [];
  fs.createReadStream(path.join(__dirname, '../data/hookfish.csv'))
    .pipe(csvparser())
    .on('data', (data) => results.push(data))
    .on('end', resolve(results));
});

const gamineDataPromise = new Promise((resolve, reject) => {
  const results = [];
  fs.createReadStream(path.join(__dirname, '../data/gamine.csv'))
    .pipe(csvparser())
    .on('data', (data) => results.push(data))
    .on('end', resolve(results));
});

const getPercentile = (arr, percentile) => {
  const sorted = arr.sort((a, b) => a - b);
  const pos = (sorted.length - 1) * percentile;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
  } else {
    return Math.floor(sorted[base]);
  }
};

const getTotalCompRanges = (data) => {
  const totalComps = data.map(
    ({ salary, bonus }) => parseInt(salary) + parseInt(bonus)
  );

  return {
    p10: getPercentile(totalComps, 0.1),
    p25: getPercentile(totalComps, 0.25),
    p50: getPercentile(totalComps, 0.5),
    p75: getPercentile(totalComps, 0.75),
    p90: getPercentile(totalComps, 0.9),
  };
};

const getTotalCompRangeByGroup = (key, data) => {
  const uniqueValues = {};
  data.forEach((row) => {
    if (!uniqueValues[row[key]]) {
      uniqueValues[row[key]] = 1;
    }
  });

  return Object.keys(uniqueValues).map((value) => {
    // added this line, to fix the remaining issue, after the interview :)
    const filteredData = data.filter((row) => row[key] === value);
    return {
      [key]: value,
      range: getTotalCompRanges(filteredData),
    };
  });
};

const list = async (req, res) => {
  const hookFishData = await hookfishDataPromise;
  const gamineData = await gamineDataPromise;

  const { groupBy } = req.query;

  if (!groupBy) {
    res.json({
      restaurants: [
        { name: 'Hookfish', ranges: getTotalCompRanges(hookFishData) },
        { name: 'Gamine', ranges: getTotalCompRanges(gamineData) },
      ],
    });
  }

  res.json({
    restaurants: [
      {
        name: 'Hookfish',
        ranges: getTotalCompRangeByGroup(groupBy, hookFishData),
      },
      {
        name: 'Gamine',
        ranges: getTotalCompRangeByGroup(groupBy, gamineData),
      },
    ],
  });
};

export const compensation = { list };
