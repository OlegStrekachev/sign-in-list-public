import mongoose from "mongoose";
import Kid from "./../models/newKidModel.js";

// Your code here

// Function to create table data for a weekday and age group
function createTableData(day, kidsData) {
  const tableRows = [];

  let counter = 1;

  kidsData = kidsData.filter((kid) => kid.days.includes(day));

  // console.log(`Filtered kids for ${day}:`, kidsData.map(k => k.name));

  kidsData.forEach((kid) => {
    const color = kid.color;
    const row = [
      { text: counter, bold: true },
      { text: kid.name, italics: true, color: color },
      { text: "", italics: true, color: color },
      { text: "", italics: true, color: color },
      { text: "", italics: true, color: color },
      { text: "", italics: true, color: color },
    ];
    tableRows.push(row);
    counter++;
  });

  return tableRows;
}

// Function to generate the document definition
async function generateDocumentDefinition(weektype) {
  console.log("GENERATE DOCUMENT DEFINITION", weektype);
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Fetch all documents from the "kids" collection
    const kids = await Kid.find({});

    console.table("KIDS", kids);

    // Filter kids into age ranges
    const kids0to1 = kids.filter((kid) => kid.age >= 0 && kid.age < 2);
    const kids2to3 = kids.filter((kid) => kid.age >= 2 && kid.age < 3);
    const kids3Plus = kids.filter((kid) => kid.age >= 3);

    // Document definition
    const dd = {
      pageSize: "A4",
      content: [],
      styles: {
        header: {
          fontSize: 22, // changed from 18
          bold: true,
          margin: [0, 0, 0, 12], // added a bit more margin
        },
        subheader: {
          fontSize: 20, // changed from 16
          bold: true,
          margin: [0, 12, 0, 6], // added a bit more margin
        },
        tableExample: {
          margin: [0, 6, 0, 18], // added a bit more margin
        },
        tableHeader: {
          bold: true,
          fillColor: "lightblue",
          fontSize: 15, // changed from 13
          color: "black",
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
    };

    // Age ranges
    const ageRanges = [
      { name: "0-2", kids: kids0to1, color: "green" },
      { name: "2-3", kids: kids2to3, color: "blue" },
      { name: "3+", kids: kids3Plus, color: "red" },
    ];

    // flatten and assign color

    const flattenedKids = ageRanges.flatMap((ageGroup) =>
      ageGroup.kids.map((kid) => ({
        ...kid._doc,
        color: ageGroup.color,
      }))
    );

    const sortedKids = flattenedKids.sort((a, b) => {
      // Sort by age
      if (a.age !== b.age) {
        return a.age - b.age;
      }
      // Sort by name within the same age group
      if (a.name && b.name) {
        return a.name.localeCompare(b.name, "en", {
          sensitivity: "base",
        });
      }
      // Handle cases where name is missing for some objects
      return 0;
    });

    // Iterate through weekdays
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const curr = new Date();

    // Given current date, adjust to Monday of the current week
    curr.setDate(curr.getDate() - (curr.getDay() || 7) + 1);

    weekdays.forEach((weekday, index) => {
      let dateForCalculation;

      if (weektype === "currentWeek") {
        dateForCalculation = new Date(
          curr.getTime() + index * 24 * 60 * 60 * 1000
        );
      } else {
        dateForCalculation = new Date(
          curr.getTime() + (index + 7) * 24 * 60 * 60 * 1000
        );
      }

      const dayOfWeekDate = dateForCalculation 
      .toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      })
      .replace(/, /g, "/"); // Replace the comma and space after the month with a slash

      // Create table data for the current weekday and flattened kids
      const tableData = createTableData(weekday.substring(0, 2), sortedKids);

      // Setting up Date

      // Add weekday and table to the document definition
      dd.content.push(
        { text: `${dayOfWeekDate} ${weekday} `, style: "header" },
        {
          style: "tableExample",
          table: {
            widths: ["5%", "39%", "*", "*", "*", "*"],
            body: [
              // Table headers
              [
                { text: "", style: "tableHeader" },
                { text: "Name", style: "tableHeader" },
                { text: "In", style: "tableHeader" },
                { text: "Initial", style: "tableHeader" },
                { text: "Out", style: "tableHeader" },
                { text: "Initial", style: "tableHeader" },
              ],
              // Table rows
              ...tableData,
            ],
          },
        }
      );

      // Add page break after each weekday except the last one
      if (index < weekdays.length - 1) {
        dd.content.push({ text: "", pageBreak: "after" });
      }
    });

    // Disconnect from MongoDB
    // mongoose.disconnect();

    return dd;
  } catch (err) {
    console.error("Error:", err);
  }
}

export default generateDocumentDefinition;
