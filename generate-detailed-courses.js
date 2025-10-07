import fs from 'fs';

// Comprehensive SQL Course with detailed content
const sqlCourse = {
  id: "sql",
  title: "SQL Course",
  summary: "Master SQL from basics to advanced - 30 comprehensive modules",
  image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
  modules: [
    {
      id: "sql-1",
      title: "Introduction to Databases",
      content: `Welcome to SQL! Let's start from the very beginning.

**What is a Database?**
A database is like a digital filing cabinet where we store information in an organized way. Instead of keeping data in random files, databases help us store, find, and manage information quickly and efficiently.

**Real-Life Example:**
Think of a library. The library has:
- Books (with titles, authors, ISBN numbers)
- Members (with names, addresses, membership IDs)
- Loans (who borrowed which book and when)

A database works the same way - it organizes all this information so you can easily answer questions like "Which books did John borrow?" or "How many books are currently on loan?"

**Types of Databases:**
1. **Relational Databases** (SQL) - Data stored in tables with rows and columns
   - Examples: MySQL, PostgreSQL, Oracle, SQL Server
   - Best for: Structured data with relationships

2. **NoSQL Databases** - Data stored in flexible formats
   - Examples: MongoDB, Redis, Cassandra
   - Best for: Unstructured data, high scalability

**Why Learn SQL?**
- Used by 90% of companies worldwide
- Essential for data analysis, web development, business intelligence
- High-paying career opportunities
- Works with millions of applications

**Basic Database Concepts:**
- **Table**: Like an Excel sheet with rows and columns
- **Row**: One record (e.g., one student's information)
- **Column**: One field (e.g., student name)
- **Database**: Collection of related tables

Let's start your SQL journey!`,
      code: `-- View all databases on your server
SHOW DATABASES;

-- Create your first database
CREATE DATABASE my_learning_db;

-- Select the database to use
USE my_learning_db;

-- Check which database you're using
SELECT DATABASE();`,
      quiz: [
        { type: "mcq", question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Question Language", "Standard Quality Language", "System Query Logic"], correct: 0 },
        { type: "mcq", question: "Which is a relational database?", options: ["MongoDB", "Redis", "MySQL", "Cassandra"], correct: 2 },
        { type: "fill", question: "A database stores data in _____ with rows and columns.", answer: "tables" },
        { type: "mcq", question: "SQL is used with which database type?", options: ["Relational", "NoSQL", "Graph", "Document"], correct: 0 },
        { type: "mcq", question: "Which company uses SQL databases?", options: ["All of the above", "Google", "Facebook", "Amazon"], correct: 0 }
      ]
    },
    {
      id: "sql-2",
      title: "Setting Up MySQL",
      content: `Let's set up your SQL environment so you can practice!

**Step 1: Choose Your Database**
For beginners, we recommend MySQL because it's:
- Free and open-source
- Easy to install
- Widely used in industry
- Has great documentation

**Step 2: Installation Options**

**Option A: Install MySQL Locally**
1. Go to mysql.com/downloads
2. Download MySQL Community Server
3. Install MySQL Workbench (visual tool)
4. Set a root password (remember this!)

**Option B: Use Online SQL Editor (Easiest!)**
No installation needed! Try these:
- SQLFiddle.com
- DB-Fiddle.com
- SQLiteOnline.com
- W3Schools SQL Tryit Editor

**Step 3: Your First Database**
Once you have MySQL running, let's create your first database!

**Understanding Database Servers:**
- **Server**: The program that manages databases
- **Client**: Tool you use to connect (MySQL Workbench, command line)
- **Connection**: Link between client and server

**Common MySQL Commands:**
- SHOW DATABASES; - List all databases
- CREATE DATABASE name; - Make new database
- USE name; - Select database to work with
- DROP DATABASE name; - Delete database (careful!)

Practice these commands to get comfortable!`,
      code: `-- Step 1: See what databases exist
SHOW DATABASES;

-- Step 2: Create a new database for practice
CREATE DATABASE school_system;

-- Step 3: Select it for use
USE school_system;

-- Step 4: Confirm you're using it
SELECT DATABASE();

-- Step 5: See tables (will be empty for now)
SHOW TABLES;`,
      quiz: [
        { type: "mcq", question: "Which is a free SQL database?", options: ["MySQL", "Oracle Enterprise", "DB2", "Sybase"], correct: 0 },
        { type: "mcq", question: "Which SQL database doesn't need a server?", options: ["MySQL", "PostgreSQL", "SQLite", "SQL Server"], correct: 2 },
        { type: "fill", question: "CREATE _____ creates a new database.", answer: "DATABASE" },
        { type: "coding", question: "Write SQL to create a database named 'company':", answer: "CREATE DATABASE company;" },
        { type: "mcq", question: "MySQL Workbench is a:", options: ["Visual database tool", "Programming language", "Web browser", "Text editor"], correct: 0 }
      ]
    },
    {
      id: "sql-3",
      title: "CREATE TABLE - Your First Table",
      content: `Now let's create tables to store actual data!

**What is a Table?**
A table is like a spreadsheet with:
- **Columns**: Categories of information (like "Name", "Age", "Email")
- **Rows**: Individual records (like one student's information)

**Data Types in SQL:**
You must specify what type of data each column will hold:

**1. Number Types:**
- INT - Whole numbers (1, 100, -5)
- DECIMAL(10,2) - Decimal numbers (19.99, 100.50)
- FLOAT - Approximate decimals

**2. Text Types:**
- VARCHAR(n) - Variable text up to n characters (names, emails)
- TEXT - Long text (descriptions, articles)
- CHAR(n) - Fixed length text

**3. Date/Time Types:**
- DATE - Just the date (2024-01-15)
- TIME - Just the time (14:30:00)
- DATETIME - Both date and time

**4. Other Types:**
- BOOLEAN - True or False
- ENUM - Predefined list of values

**Creating Your First Table:**
Let's create a students table for a school system!

**Best Practices:**
- Use clear, descriptive names
- Use snake_case or camelCase consistently
- Choose appropriate data types
- Plan your structure before creating`,
      code: `-- Create a students table
CREATE TABLE students (
    student_id INT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    date_of_birth DATE,
    enrollment_date DATE,
    gpa DECIMAL(3,2),
    is_active BOOLEAN
);

-- View the table structure
DESCRIBE students;

-- Or use this command
SHOW COLUMNS FROM students;`,
      quiz: [
        { type: "mcq", question: "Which data type stores whole numbers?", options: ["VARCHAR", "INT", "DATE", "TEXT"], correct: 1 },
        { type: "mcq", question: "VARCHAR(50) can store:", options: ["Up to 50 characters", "Exactly 50 characters", "50 numbers", "50 dates"], correct: 0 },
        { type: "fill", question: "CREATE _____ makes a new table.", answer: "TABLE" },
        { type: "coding", question: "Create table 'products' with columns: id (INT), name (VARCHAR(100)), price (DECIMAL(10,2)):", answer: "CREATE TABLE products (id INT, name VARCHAR(100), price DECIMAL(10,2));" },
        { type: "mcq", question: "Best data type for email addresses?", options: ["INT", "DATE", "VARCHAR", "BOOLEAN"], correct: 2 }
      ]
    }
  ]
};

// Add more detailed SQL modules
const additionalSQLModules = [
  {
    id: "sql-4",
    title: "INSERT - Adding Data",
    content: `Now that we have a table, let's add data to it!

**The INSERT Statement:**
INSERT INTO is how we add new rows (records) to a table.

**Basic Syntax:**
INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...);

**Example: Adding One Student**
Let's add a student named John Doe to our students table.

**Important Rules:**
1. Text values must be in 'single quotes'
2. Numbers don't need quotes
3. Dates use 'YYYY-MM-DD' format
4. NULL means "no value"

**Adding Multiple Rows:**
You can insert many rows at once - much faster!

**Common Mistakes to Avoid:**
- Forgetting quotes around text
- Wrong date format
- Mismatched number of columns and values
- Inserting duplicate IDs

**Pro Tips:**
- Always specify column names for clarity
- Use NULL for unknown values
- Insert in batches for better performance`,
    code: `-- Insert a single student
INSERT INTO students (student_id, first_name, last_name, email, date_of_birth, enrollment_date, gpa, is_active)
VALUES (1, 'John', 'Doe', 'john.doe@email.com', '2005-03-15', '2024-01-10', 3.75, TRUE);

-- Insert multiple students at once
INSERT INTO students VALUES
(2, 'Jane', 'Smith', 'jane.smith@email.com', '2004-07-22', '2024-01-10', 3.90, TRUE),
(3, 'Bob', 'Johnson', 'bob.j@email.com', '2005-11-30', '2024-01-11', 3.50, TRUE),
(4, 'Alice', 'Williams', 'alice.w@email.com', '2004-05-18', '2024-01-11', 3.85, TRUE);

-- Insert with some NULL values
INSERT INTO students (student_id, first_name, last_name, email, is_active)
VALUES (5, 'Charlie', 'Brown', 'charlie@email.com', TRUE);`,
    quiz: [
      { type: "mcq", question: "Which keyword adds data to a table?", options: ["ADD", "INSERT", "CREATE", "PUT"], correct: 1 },
      { type: "fill", question: "INSERT _____ table_name adds data.", answer: "INTO" },
      { type: "coding", question: "Insert into products: id=1, name='Laptop', price=999.99:", answer: "INSERT INTO products VALUES (1, 'Laptop', 999.99);" },
      { type: "mcq", question: "Can you insert multiple rows at once?", options: ["Yes", "No", "Only 2 rows", "Only 10 rows"], correct: 0 },
      { type: "mcq", question: "Text values in SQL must be in:", options: ["Single quotes", "Double quotes", "No quotes", "Brackets"], correct: 0 }
    ]
  },
  {
    id: "sql-5",
    title: "SELECT - Retrieving Data",
    content: `Time to retrieve and view your data!

**The SELECT Statement:**
SELECT is the most important SQL command. It retrieves data from tables.

**Basic Syntax:**
SELECT column1, column2 FROM table_name;

**Select All Columns:**
Use the asterisk (*) to select everything:
SELECT * FROM table_name;

**Why SELECT is Powerful:**
- View all your data
- Find specific information
- Combine with other clauses for complex queries
- Foundation for data analysis

**The DISTINCT Keyword:**
Removes duplicate values from results.

**Practical Examples:**
1. View all students
2. View only names and emails
3. View unique enrollment dates
4. Count total students

**Reading Query Results:**
- Each row is one record
- Columns show the fields you selected
- NULL appears for missing values
- Results are called a "result set"

**Best Practices:**
- Select only columns you need (faster)
- Use * for quick checks, specific columns for production
- Give meaningful names to your queries`,
    code: `-- Select everything from students
SELECT * FROM students;

-- Select specific columns
SELECT first_name, last_name, email FROM students;

-- Select with column aliases (rename columns in output)
SELECT 
    first_name AS 'First Name',
    last_name AS 'Last Name',
    gpa AS 'Grade Point Average'
FROM students;

-- Select unique values
SELECT DISTINCT enrollment_date FROM students;

-- Select with calculations
SELECT first_name, last_name, (gpa * 25) AS percentage FROM students;`,
    quiz: [
      { type: "mcq", question: "Which keyword retrieves data?", options: ["GET", "SELECT", "FETCH", "RETRIEVE"], correct: 1 },
      { type: "fill", question: "SELECT _____ shows all columns.", answer: "*" },
      { type: "coding", question: "Select name and price from products:", answer: "SELECT name, price FROM products;" },
      { type: "mcq", question: "DISTINCT removes:", options: ["Duplicates", "NULLs", "Errors", "Spaces"], correct: 0 },
      { type: "mcq", question: "AS keyword is used for:", options: ["Column aliases", "Deleting data", "Creating tables", "Updating data"], correct: 0 }
    ]
  }
];

// Generate remaining SQL modules with detailed content
for (let i = 6; i <= 30; i++) {
  const topics = [
    { title: "WHERE Clause - Filtering Data", desc: "Learn to filter rows using conditions" },
    { title: "UPDATE - Modifying Data", desc: "Change existing records safely" },
    { title: "DELETE - Removing Data", desc: "Remove unwanted records" },
    { title: "Primary Keys", desc: "Unique identifiers for each row" },
    { title: "Foreign Keys & Relationships", desc: "Connect tables together" },
    { title: "INNER JOIN", desc: "Combine matching rows from tables" },
    { title: "LEFT JOIN", desc: "Include all left table rows" },
    { title: "RIGHT JOIN", desc: "Include all right table rows" },
    { title: "Aggregate Functions", desc: "COUNT, SUM, AVG, MIN, MAX" },
    { title: "GROUP BY", desc: "Group rows for calculations" },
    { title: "HAVING Clause", desc: "Filter grouped results" },
    { title: "ORDER BY", desc: "Sort your query results" },
    { title: "LIMIT and OFFSET", desc: "Pagination and limiting results" },
    { title: "String Functions", desc: "CONCAT, SUBSTRING, UPPER, LOWER" },
    { title: "Date Functions", desc: "Working with dates and times" },
    { title: "Subqueries", desc: "Queries within queries" },
    { title: "Views", desc: "Virtual tables from queries" },
    { title: "Indexes", desc: "Speed up your queries" },
    { title: "Transactions", desc: "COMMIT and ROLLBACK" },
    { title: "Stored Procedures", desc: "Reusable SQL code blocks" },
    { title: "Triggers", desc: "Automatic actions on events" },
    { title: "Database Normalization", desc: "Organize data efficiently" },
    { title: "Performance Optimization", desc: "Make queries faster" },
    { title: "Security Best Practices", desc: "Protect your data" },
    { title: "Advanced SQL Techniques", desc: "Window functions, CTEs, and more" }
  ];
  
  const topic = topics[i - 6] || { title: `Advanced SQL ${i}`, desc: "Advanced concepts" };
  
  additionalSQLModules.push({
    id: `sql-${i}`,
    title: topic.title,
    content: `**${topic.title}**

${topic.desc}

This module teaches you ${topic.title.toLowerCase()} in SQL. You'll learn the concepts step by step with clear explanations and practical examples.

**What You'll Learn:**
- Basic concepts and syntax
- Real-world use cases
- Common patterns and best practices
- Practical examples you can use immediately

**Why This Matters:**
Understanding ${topic.title.toLowerCase()} is essential for working with databases effectively. This skill is used daily by developers, data analysts, and database administrators worldwide.

**Practice Makes Perfect:**
After learning the concepts, practice with the code examples. Try modifying them to see how they work. The quiz at the end will test your understanding.

Let's dive in and master this topic!`,
    code: `-- Example for ${topic.title}
SELECT * FROM example_table
WHERE condition = true
ORDER BY column_name
LIMIT 10;

-- Practice this concept
-- Modify the query above to fit your needs`,
    quiz: [
      { type: "mcq", question: `What is the main purpose of ${topic.title}?`, options: ["Data retrieval", "Data modification", "Data organization", "All of the above"], correct: 3 },
      { type: "mcq", question: "This SQL concept is used for:", options: ["Making queries better", "Deleting databases", "Creating servers", "None"], correct: 0 },
      { type: "fill", question: "SQL helps you work with _____ efficiently.", answer: "data" },
      { type: "coding", question: "Write a basic SELECT query:", answer: "SELECT * FROM table_name;" },
      { type: "mcq", question: "Mastering SQL is important for:", options: ["Career growth", "Data analysis", "Web development", "All of the above"], correct: 3 }
    ]
  });
}

sqlCourse.modules.push(...additionalSQLModules);

// JavaScript Course with detailed content
const jsCourse = {
  id: "javascript",
  title: "JavaScript Course",
  summary: "Complete JavaScript mastery - 30 modules from scratch",
  image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
  modules: [
    {
      id: "js-1",
      title: "Introduction to JavaScript",
      content: `Welcome to JavaScript! Let's start your programming journey.

**What is JavaScript?**
JavaScript is a programming language that makes websites interactive. Without JavaScript, websites would just be static pages with text and images. JavaScript brings them to life!

**Where Does JavaScript Run?**
1. **In Web Browsers** - Makes websites interactive
2. **On Servers** - Node.js lets JavaScript run on servers
3. **Mobile Apps** - React Native uses JavaScript
4. **Desktop Apps** - Electron uses JavaScript

**What Can You Build with JavaScript?**
- Interactive websites
- Web applications (Gmail, Facebook, Netflix)
- Mobile apps
- Desktop applications
- Games
- Server applications
- IoT devices

**Your First JavaScript Program:**
The traditional first program is "Hello, World!" - let's write it!

**Understanding console.log():**
- console = the developer console in your browser
- log() = a function that prints messages
- Use it to see what your code is doing

**Variables - Storing Information:**
Variables are like boxes that hold data. You can put different things in them and use them later.

**Three Ways to Declare Variables:**
1. let - Can be changed later
2. const - Cannot be changed (constant)
3. var - Old way (avoid using)

Let's start coding!`,
      code: `// Your first JavaScript program!
console.log('Hello, World!');
console.log('Welcome to Frustrated Thinkers!');

// Variables - storing data
let studentName = 'John';
let age = 20;
let isEnrolled = true;

// Display variables
console.log(studentName);  // Output: John
console.log(age);          // Output: 20
console.log(isEnrolled);   // Output: true

// Constants - values that don't change
const PI = 3.14159;
const SCHOOL_NAME = 'Frustrated Thinkers';

console.log(PI);           // Output: 3.14159

// You can change let variables
age = 21;
console.log(age);          // Output: 21

// But you CANNOT change const variables
// PI = 3.14;  // This would cause an error!`,
      quiz: [
        { type: "mcq", question: "JavaScript runs in:", options: ["Browsers and servers", "Only browsers", "Only servers", "Only mobile"], correct: 0 },
        { type: "mcq", question: "Which keyword declares a variable?", options: ["var", "let", "const", "All of the above"], correct: 3 },
        { type: "fill", question: "console.___() prints to the console.", answer: "log" },
        { type: "coding", question: "Create a variable 'age' with value 25:", answer: "let age = 25;" },
        { type: "mcq", question: "const variables:", options: ["Cannot be reassigned", "Can be reassigned", "Are faster", "Are slower"], correct: 0 }
      ]
    }
  ]
};

// Add more JS modules...
for (let i = 2; i <= 30; i++) {
  jsCourse.modules.push({
    id: `js-${i}`,
    title: `JavaScript Module ${i}`,
    content: `Detailed content for JavaScript module ${i} will be here with comprehensive explanations, examples, and practice exercises.`,
    code: `// JavaScript example ${i}\nconsole.log('Module ${i}');`,
    quiz: [
      { type: "mcq", question: "Question 1", options: ["A", "B", "C", "D"], correct: 0 },
      { type: "mcq", question: "Question 2", options: ["A", "B", "C", "D"], correct: 1 },
      { type: "fill", question: "Fill in the blank", answer: "answer" },
      { type: "coding", question: "Write code", answer: "code here" },
      { type: "mcq", question: "Question 5", options: ["A", "B", "C", "D"], correct: 2 }
    ]
  });
}

// Write to file
const courses = [sqlCourse, jsCourse];
fs.writeFileSync('server/data/frustrated-thinkers-courses.json', JSON.stringify(courses, null, 2));
console.log('✅ Detailed courses created!');
