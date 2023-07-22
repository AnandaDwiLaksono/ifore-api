const RandomForestRegression = require('ml-random-forest').RandomForestRegression;
const formidable = require('formidable');

const form = formidable({ multiples: true });

const RandomForestModel = (req, res) => {
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({ message: 'Error parsing form data' });
      return;
    }

    let salesData = fields.salesData;
    let predictionResults = [];

    for (let i = 0; i < 3; i++) {
      let trainingSet = new Array(salesData.length - 3);
      let predictions = new Array(salesData.length - 3);

      for (let i = 0; i < salesData.length - 3; i++) {
        trainingSet[i] = salesData.slice(i, i + 3);
        predictions[i] = salesData[i + 3];
      };

      const options = {
        seed: 3,
        maxFeatures: 2,
        replacement: false,
        nEstimators: 200
      };

      const randomForest = new RandomForestRegression(options);

      randomForest.train(trainingSet, predictions);

      const result = randomForest.predict([salesData.slice(-3)]);

      predictionResults.push(result[0]);
      salesData.push(result[0]);
    }

    res.status(200).json({
      message: 'Get prediction',
      data: predictionResults,
    });
  });
};

module.exports = { RandomForestModel };
