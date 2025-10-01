// queries.js
const { MongoClient } = require("mongodb");

// your connection string
const uri = "mongodb://127.0.0.1:27017"; 
const client = new MongoClient(uri);
const db = client.db("plp_bookstore");
async function run() {
  try {
    // connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB ✅");

    // select database and collection
    const db = client.db("plp_bookstore");
    const collection = db.collection("books");

    // Find all books in a specific genre:
    const results = await collection.find({"genre": "Fiction"}).toArray();
    console.log("Books in Fiction genre:");
    console.log(results);

    // Find books published after 1950:
    const results2 = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    console.log("Books published after 1950:");
    console.log(results2);

    // Find books by a specific author:
    const results3 = await collection.find({ author: "George Orwell" }).toArray();
    console.log('Books by George Orwell:');
    console.log(results3);

    // Find update price of a specific book:
    const updateResult = await collection.updateOne({ title: "1984" }, { $set: { price: 9.99 } });
    console.log(`Updated ${updateResult.modifiedCount} document(s)`);

    // Delete a book by title:
    const deleteResult = await collection.deleteOne({ title: "The Great Gatsby" });
    console.log(`Deleted ${deleteResult.deletedCount} document(s)`);

    // Advanced Query: Find books that are both in stock and published after 2010:
    const advancedResults = await collection.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
    console.log("Books in stock and published after 2010:");
    console.log(advancedResults);

    //Advanced Query: use projection to return only title, author and price fields:
    const projectionResults = await collection.find({}, { projection: { title: 1, author: 1, price: 1 } }).toArray();
    console.log("Books with title, author, and price:");
    console.log(projectionResults);

    //Advanced Query: use sorting to display books sorted by price both in descending order and ascending order:
    const sortedResults = await collection.find({}).sort({ price: -1 }).toArray();
    console.log("Books sorted by price (descending):");
    console.log(sortedResults);

    const sortedResultsAsc = await collection.find({}).sort({ price: 1 }).toArray();
    console.log("Books sorted by price (ascending):");
    console.log(sortedResultsAsc);

    //Advanced Query: use limit and skip to  implement pagination (5 books per page):
    const pageSize = 5;
    const pageNumber = 1; // Change this to get different pages
    const paginatedResults = await collection.find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    console.log(`Books - Page ${pageNumber}:`);
    console.log(paginatedResults);

    // Create an aggregation pipeline to calculate the average price of books by genre:
    const aggregationResults = await collection.aggregate([
      {
        $group: {
          _id: "$genre",
          averagePrice: { $avg: "$price" }
        }
      }
    ]).toArray();
    console.log("Average price of books by genre:");
    console.log(aggregationResults);

    // Create an aggregation pipeline to find the authors with the most books in the collection:
    const authorAggregationResults = await collection.aggregate([
      {
        $group: {
          _id: "$author",
          bookCount: { $sum: 1 }
        }
      },
      {
        $sort: { bookCount: -1 }
      }
    ]).toArray();
    console.log("Authors with the most books:");
    console.log(authorAggregationResults);

    // Implement a pipeline that group books by publication decade and counts them:
    const decadeAggregationResults = await collection.aggregate([
      {
        $group: {
          _id: { $subtract: [ { $divide: [ "$published_year", 10 ] }, 1 ] },
          bookCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();
    console.log("Books by publication decade:");
    console.log(decadeAggregationResults);

    // Create an index on the title field to optimize queries:
    await collection.createIndex({ title: 1 });

    // Create a compound index on author and published_year:
    await collection.createIndex({ author: 1, published_year: 1 });

    // Use the explain method to demonstrate the performance improvement with my indexes:
    const explainResults = await collection.find({ title: "1984" }).explain("executionStats");
    console.log("Explain plan for finding '1984':");
    console.log(explainResults);

  } catch (err) {
    console.error("Error occurred while fetching books:", err);
  } finally {
    await client.close();
  }
}

run();


