const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("Database Connected.")
})


const sample = (array) => {
	return array[Math.floor(Math.random() * array.length)]
}


const seedDB = async() => {
	await Campground.deleteMany({})
	const c = new Campground({title: "new field"})
	const price = Math.floor(Math.random() * 20) + 10;


	for(let i=0; i<50; i++){
		const random1000 = Math.floor(Math.random()*1000);
		
		const camp = new Campground({
			author: "60c24e9ddb907253d4af3592",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: 'https://res.cloudinary.com/dca80svmv/image/upload/v1624466790/YelpCamp/i0m7s3kfv2mfhqdscjb8.png',
				  	filename: 'YelpCamp/i0m7s3kfv2mfhqdscjb8'
				},
				{
				  	url: 'https://res.cloudinary.com/dca80svmv/image/upload/v1624466791/YelpCamp/u2ckfpd3kescyf6benbm.png',
				  	filename: 'YelpCamp/u2ckfpd3kescyf6benbm'
				}
			], 
			description: "lorem and some shityyyyyyyyyy band ai d k sksd djds sksbjbsbkj sajkbsajbsa sasabsa askjsa sakj",
			price: price
		})
		await camp.save()
	}

}


seedDB().then(() => {
	mongoose.connection.close();
})
