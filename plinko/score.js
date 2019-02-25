const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
	// Ran every time a balls drops into a bucket
	outputs.push([ dropPosition, bounciness, size, bucketLabel ]);
}

function runAnalysis() {
	// Write code here to analyze stuff

	const testSetSize = 10;
	const [ testSet, trainingSet ] = splitDataset(minMax(outputs, 3), 10);

	_.range(1, 15).forEach((k) => {
		const accuracy = _.chain(testSet)
			.filter((testPoint) => knn(trainingSet, _.initial(testPoint), k) === testPoint[3])
			.size()
			.divide(testSetSize)
			.value();

		console.log('For k of ', k, 'accuracy:', accuracy);
	});
}

function knn(dataset, point, k) {
	return _.chain(dataset)
		.map((row) => [ distance(_.initial(row), point), _.last(row) ])
		.sortBy(0)
		.slice(0, k)
		.countBy((row) => row[1])
		.toPairs()
		.sortBy(1)
		.last()
		.first()
		.parseInt()
		.value();
}

function distance(pointA, pointB) {
	return _.chain(pointA).zip(pointB).map(([ a, b ]) => (a - b) ** 2).sum().value() ** 0.5;
}

function splitDataset(data, testCount) {
	const shuffled = _.shuffle(data);

	const testSet = _.slice(shuffled, 0, testCount);
	const trainingSet = _.slice(shuffled, testCount);

	return [ testSet, trainingSet ];
}

function minMax(data, featureCount) {
	const clonedData = _.cloneDeep(data);

	for (let i = 0; i < featureCount; i++) {
		const column = clonedData.map((row) => row[i]);

		const min = _.min(column);
		const max = _.max(column);

		for (let j = 0; j < clonedData.length; j++) {
			clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
		}
	}

	return clonedData;
}
